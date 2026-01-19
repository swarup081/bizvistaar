'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import RAZORPAY_CONFIG, { getPlanId, getKeyId, getRazorpayMode, getStandardPlanId, COUPON_CONFIG } from '../config/razorpay-config';

// Lazy Initialize Supabase Admin
const getSupabaseAdmin = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
};

// Helper to get authenticated user
async function getUser(accessToken = null) {
  if (accessToken) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        }
      );
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
  }

  try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
        {
          cookies: {
            getAll() { return cookieStore.getAll() },
            setAll(cookiesToSet) {
               try {
                 cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
               } catch { /* pass */ }
            },
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
  } catch (e) {
      return null;
  }
}

// Check Rate Limits using 'rate_limits' table
async function checkRateLimit(userId) {
    const supabaseAdmin = getSupabaseAdmin();
    const limitWindow = 60 * 60 * 1000; // 1 Hour
    const maxRequests = 10;

    const oneHourAgo = new Date(Date.now() - limitWindow).toISOString();

    const { count, error } = await supabaseAdmin
        .from('rate_limits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('endpoint', 'create_subscription')
        .gte('created_at', oneHourAgo);

    if (error) {
        console.error("Rate limit check failed", error);
        return true; // Fail open if DB error, but log it.
    }

    return (count || 0) < maxRequests;
}

// Log Rate Limit Attempt
async function logRateLimit(userId, ip) {
    const supabaseAdmin = getSupabaseAdmin();
    await supabaseAdmin.from('rate_limits').insert({
        user_id: userId,
        ip_address: ip, // Note: IP capture in server actions is tricky, passing from client or headers is needed.
        endpoint: 'create_subscription'
    });
}

// ... (Existing helper functions: hasUserUsedCoupon, hasPriorSubscriptions, getCouponUsageCount, saveBillingDetailsAction) ...
// Re-pasting them for completeness if needed, or assuming they exist from previous context.
// For brevity in this turn, I will just ensure they are present in the final file write.

async function hasUserUsedCoupon(userId, couponCode) {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', userId)
        .eq('metadata->>coupon_used', couponCode)
        .limit(1);
    if (error) return false;
    return data && data.length > 0;
}

async function hasPriorSubscriptions(userId) {
    const supabaseAdmin = getSupabaseAdmin();
    const { count, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    if (error) return false;
    return count > 0;
}

async function getCouponUsageCount(couponCode) {
    const supabaseAdmin = getSupabaseAdmin();
    const { count, error } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('metadata->>coupon_used', couponCode)
        .in('status', ['active', 'past_due']);
    if (error) return 0;
    return count || 0;
}

export async function saveBillingDetailsAction(billingData, accessToken = null) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const user = await getUser(accessToken);
    if (!user) throw new Error("Unauthorized");

    if (!billingData.fullName || !billingData.address || !billingData.state || !billingData.zipCode || !billingData.country) {
        throw new Error("Missing required billing fields.");
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        billing_address: billingData,
        full_name: billingData.fullName
      })
      .eq('id', user.id);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error saving billing details:", err);
    return { success: false, error: err.message };
  }
}

export async function validateCouponAction(couponCode) {
    const normalized = couponCode ? couponCode.trim().toUpperCase() : '';
    const config = COUPON_CONFIG[normalized];
    let user = null;
    try { user = await getUser(); } catch(e) {}

    if (config && config.active) {
        if (config.expiresAt) {
            const now = new Date();
            if (now > new Date(config.expiresAt)) return { valid: false, message: "Coupon Expired" };
        }
        if (config.limit) {
            const currentUsage = await getCouponUsageCount(normalized);
            if (currentUsage >= config.limit) return { valid: false, message: "Coupon Usage Limit Reached" };
        }
        return {
            valid: true,
            type: config.type,
            description: config.description,
            code: normalized,
            percentOff: config.percentOff,
            maxDiscount: config.maxDiscount
        };
    }
    return { valid: false, message: "Invalid Coupon" };
}

export async function verifyPaymentAction(paymentId, subscriptionId, signature) {
    try {
        if (!paymentId || !subscriptionId || !signature) throw new Error("Missing verification parameters");

        const mode = getRazorpayMode();
        let keySecret;
        if (mode === 'live') keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET;
        else keySecret = process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET;

        if (!keySecret) throw new Error("Server Misconfiguration: Missing Key Secret");

        const text = paymentId + '|' + subscriptionId;
        const generatedSignature = crypto.createHmac('sha256', keySecret).update(text).digest('hex');

        if (generatedSignature !== signature) throw new Error("Invalid Signature");

        return { success: true };
    } catch (err) {
        console.error("Payment Verification Failed:", err);
        return { success: false, error: "Payment verification failed" };
    }
}

// --- NEW: Secure Checkout Details Fetcher ---
export async function getCheckoutDetailsAction(planName, billingCycle) {
    // Returns canonical price and free items configuration from SERVER
    // Prevents client-side tampering
    try {
        const standardPlanId = getStandardPlanId(planName, billingCycle); // Validates existence
        if (!standardPlanId) throw new Error("Invalid Plan");

        // Hardcoded source of truth for prices (aligned with frontend config)
        const PLAN_PRICES = {
            'Starter': { monthly: 299 },
            'Pro': { monthly: 799 },
            'Growth': { monthly: 1499 },
        };

        const planBase = PLAN_PRICES[planName] || { monthly: 0 };
        const monthlyRate = planBase.monthly;
        const isYearly = billingCycle === 'yearly';
        const basePrice = isYearly ? monthlyRate * 12 : monthlyRate;

        // Calculate Free Items Value (Server Side)
        // Hardcoded here to ensure security
        const freeItemsValue = isYearly
            ? (5988 + 2400 + 999 + 499 + 199 + 999) // Sum of yearly struck
            : (499 + 200 + 99 + 49 + 199 + 999);   // Sum of monthly struck + fixed

        return {
            success: true,
            basePrice: basePrice,
            freeItemsValue: freeItemsValue,
            planName: planName,
            billingCycle: billingCycle
        };
    } catch (err) {
        return { success: false, error: "Invalid Request" };
    }
}

// --- NEW: Subscription Status Polling ---
export async function checkSubscriptionStatusAction(subscriptionId) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data } = await supabaseAdmin
            .from('subscriptions')
            .select('status')
            .eq('razorpay_subscription_id', subscriptionId)
            .single();

        if (data && data.status === 'active') {
            return { active: true };
        }

        // Fallback: Check Razorpay API directly if DB is lagging
        const mode = getRazorpayMode();
        let keyId = getKeyId();
        let keySecret = mode === 'live' ? process.env.RAZORPAY_LIVE_KEY_SECRET : (process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET);

        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const sub = await rzp.subscriptions.fetch(subscriptionId);

        if (sub.status === 'active') {
            return { active: true, source: 'api' };
        }

        return { active: false };
    } catch (err) {
        return { active: false };
    }
}

export async function createSubscriptionAction(planName, billingCycle, couponCode, accessToken = null) {
  try {
    const user = await getUser(accessToken);
    if (!user) throw new Error("Unauthorized");

    // Rate Limit Check
    const allowed = await checkRateLimit(user.id);
    if (!allowed) throw new Error("Too many checkout attempts. Please try again later.");
    await logRateLimit(user.id, "0.0.0.0"); // Capture IP if passed, else placeholder

    const standardPlanId = getStandardPlanId(planName, billingCycle);
    if (!standardPlanId) throw new Error("Plan not found in configuration.");

    const normalizedCoupon = couponCode ? couponCode.trim().toUpperCase() : '';
    const finalPlanId = getPlanId(standardPlanId, couponCode);

    const couponConfig = COUPON_CONFIG[normalizedCoupon];
    const mode = getRazorpayMode();

    // --- ENFORCE SECURITY CONTROLS ---
    if (couponConfig) {
        if (couponConfig.limit) {
             const usage = await getCouponUsageCount(normalizedCoupon);
             if (usage >= couponConfig.limit) throw new Error("Coupon limit reached.");
        }
        if (couponConfig.usageType === 'once_per_user') {
            const used = await hasUserUsedCoupon(user.id, normalizedCoupon);
            if (used) throw new Error(`You have already used the coupon '${normalizedCoupon}'.`);
        }
        if (couponConfig.usageType === 'first_time_only') {
            const hasPrior = await hasPriorSubscriptions(user.id);
            if (hasPrior) throw new Error(`The coupon '${normalizedCoupon}' is for new customers only.`);
        }
    }

    let razorpayInstance;
    if (mode === 'live') {
         razorpayInstance = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY_ID,
            key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET,
        });
    } else {
         const configKeyId = getKeyId();
         razorpayInstance = new Razorpay({
            key_id: configKeyId,
            key_secret: process.env.RAZOPAY_Test_Key_Secret || process.env.RAZORPAY_TEST_KEY_SECRET,
        });
    }

    let totalCount = 120; // Default 10 years
    let offerId = null;
    let startAt = null;

    if (normalizedCoupon === 'FOUNDER') {
        if (billingCycle === 'monthly') {
            totalCount = 12;
        } else if (billingCycle === 'yearly') {
            totalCount = 1;
        }
    }

    if (couponConfig && couponConfig.type === 'offer_apply' && couponConfig.offerIds) {
        offerId = couponConfig.offerIds[mode];
        if (!offerId) throw new Error("Offer not available in this mode");
    }

    if (couponConfig && couponConfig.type === 'trial_period') {
        if (couponConfig.trialDays) {
             const startDate = new Date();
             startDate.setDate(startDate.getDate() + couponConfig.trialDays);
             startAt = Math.floor(startDate.getTime() / 1000);
        }
    }

    const subscriptionOptions = {
      plan_id: finalPlanId,
      customer_notify: 1,
      total_count: totalCount,
      notes: {
        user_id: user.id,
        coupon_used: normalizedCoupon || 'none',
        plan_name: planName,
        billing_cycle: billingCycle,
      }
    };

    if (offerId) {
        subscriptionOptions.offer_id = offerId;
    }
    if (startAt) {
        subscriptionOptions.start_at = startAt;
    }

    const subscription = await razorpayInstance.subscriptions.create(subscriptionOptions);

    return {
      success: true,
      subscriptionId: subscription.id,
      keyId: getKeyId(),
      planId: finalPlanId,
      offerId: offerId
    };

  } catch (err) {
    console.error("Error creating subscription:", err);
    return { success: false, error: err.message };
  }
}
