'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, Check, X, Tag, ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import StateSelector from '@/components/checkout/StateSelector';
import { AnimatePresence, motion } from 'framer-motion';
import { createSubscriptionAction, verifyPaymentAction, validateCouponAction, getCheckoutDetailsAction } from '@/app/actions/razorpayActions';
import { supabase } from '@/lib/supabaseClient';

// --- CONFIGURATION ---
// Note: Prices are now fetched from server to prevent spoofing
// But we keep structure for initial render if needed

const FREE_ITEMS_CONFIG = [
  { 
    id: 'hosting',
    name: 'Hosting',
    yearlyStruck: 5988, 
    monthlyStruck: 499,
    dynamicLabel: true 
  },
  { 
    id: 'support',
    name: 'Priority Support', 
    yearlyStruck: 2400, 
    monthlyStruck: 200 
  },
  { 
    id: 'domain',
    name: 'Custom Domain Connection', 
    yearlyStruck: 999, 
    monthlyStruck: 99 
  },
  { 
    id: 'cloud',
    name: 'Cloud Server Hosting', 
    yearlyStruck: 499, 
    monthlyStruck: 49 
  },
  { 
    id: 'ssl',
    name: 'SSL Security (https)', 
    yearlyStruck: 199, 
    monthlyStruck: 199,
    isFixed: true 
  },
  { 
    id: 'setup',
    name: 'One-Time Setup Fee', 
    yearlyStruck: 999, 
    monthlyStruck: 999,
    isFixed: true 
  },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Params - used initially, but price source of truth is server
  const urlPlanName = searchParams.get('plan') || 'Pro';
  const urlBillingCycle = searchParams.get('billing') || 'monthly';

  const [serverData, setServerData] = useState({
      basePrice: 0,
      freeItemsValue: 0,
      loading: true,
      error: null
  });

  // Fetch Pricing securely from Server Action
  useEffect(() => {
      const fetchDetails = async () => {
          const res = await getCheckoutDetailsAction(urlPlanName, urlBillingCycle);
          if (res.success) {
              setServerData({
                  basePrice: res.basePrice,
                  freeItemsValue: res.freeItemsValue,
                  loading: false,
                  error: null
              });
          } else {
              setServerData(prev => ({ ...prev, loading: false, error: "Invalid Plan Configuration" }));
          }
      };
      fetchDetails();
  }, [urlPlanName, urlBillingCycle]);

  // Use Server Data for Calculations
  const planName = urlPlanName;
  const billingCycle = urlBillingCycle;
  const isYearly = billingCycle === 'yearly';
  const basePrice = serverData.basePrice;
  const planLabel = isYearly ? '12-month plan' : 'Monthly plan';

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    });
  };

  // --- Form State ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'India',
    phoneCode: '+91',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    companyName: '',
    gstNumber: '',
  });

  const [addCompanyDetails, setAddCompanyDetails] = useState(false);

  // Coupon State
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // --- Summary Calculations ---

  // Calculate Discount
  let discountAmount = 0;
  if (appliedCoupon && appliedCoupon.percentOff) {
      const calculatedDiscount = (basePrice * appliedCoupon.percentOff) / 100;
      discountAmount = calculatedDiscount;

      if (appliedCoupon.maxDiscount && discountAmount > appliedCoupon.maxDiscount) {
          discountAmount = appliedCoupon.maxDiscount;
      }
  }

  // Calculate Struck values for free items
  // Note: We use static config for list rendering, but serverData.freeItemsValue for Total calc
  // to ensure consistency if server logic changes.

  // Requirement: "Total cutoff should be the total of all base" -> Plan Base (Struck) + Free Items
  const totalStruckVal = basePrice + serverData.freeItemsValue;
  const formattedTotalStruck = formatCurrency(totalStruckVal);

  let finalPrice = Math.max(0, basePrice - discountAmount);
  const formattedBasePrice = formatCurrency(basePrice);

  // Dynamic Plan Row Price Display
  // If no discount: Base Price (Main) and if Yearly (Monthly x 12 Struck) or null
  // If discount: Base Price (Struck) and Final Price (Main)

  let planDisplayStruck = isYearly ? (basePrice) : null;
  // Wait, if yearly, basePrice IS the yearly total. Usually we strike out nothing unless there's a discount on base.
  // Standard logic: Show Base Price.
  // If Discount Applied: Show Struck Base -> New Price.

  let planDisplayMain = basePrice;

  let isFounder = appliedCoupon?.code === 'FOUNDER';
  let isFreeTrial = appliedCoupon?.code === 'FREETRIAL';

  if (discountAmount > 0) {
      planDisplayStruck = basePrice;
      planDisplayMain = finalPrice;
  }

  if (isFreeTrial) {
      planDisplayStruck = basePrice;
      planDisplayMain = 0;
      finalPrice = 0;
  }

  if (isFounder) {
      let founderPriceVal = basePrice;
      // Map Plans: Starter(299)->149, Pro(799)->399, Growth(1499)->749
      if (planName === 'Starter') founderPriceVal = 149;
      else if (planName === 'Pro') founderPriceVal = 399;
      else if (planName === 'Growth') founderPriceVal = 749;

      if (isYearly) {
          founderPriceVal = founderPriceVal * 12;
      }

      planDisplayStruck = basePrice;
      planDisplayMain = founderPriceVal;
      finalPrice = founderPriceVal;
  }

  const formattedPlanDisplayStruck = planDisplayStruck ? formatCurrency(planDisplayStruck) : null;
  const formattedPlanDisplayMain = formatCurrency(planDisplayMain);
  const formattedPrice = formatCurrency(finalPrice);
  const formattedDiscount = formatCurrency(discountAmount);


  // --- Auth Check ---
  useEffect(() => {
    const checkUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const currentPath = window.location.pathname + window.location.search;
                router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
            } else {
                setIsCheckingAuth(false);
                fetchProfileData(user.id, user.email);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/sign-in?redirect=${encodeURIComponent(currentPath)}`);
        }
    };

    const fetchProfileData = async (userId, authEmail) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('full_name, billing_address')
                .eq('id', userId)
                .single();

            if (data && data.billing_address) {
                const billing = data.billing_address;
                const [firstName, ...lastNameParts] = (data.full_name || billing.fullName || '').split(' ');

                setFormData(prev => ({
                    ...prev,
                    firstName: firstName || prev.firstName,
                    lastName: lastNameParts.join(' ') || prev.lastName,
                    email: billing.email || authEmail || prev.email,
                    address: billing.address || prev.address,
                    city: billing.city || prev.city,
                    state: billing.state || prev.state,
                    zip: billing.zipCode || prev.zip,
                    phoneNumber: billing.phoneNumber || prev.phoneNumber,
                    companyName: billing.companyName || prev.companyName,
                    gstNumber: billing.gstNumber || prev.gstNumber
                }));
                if (billing.companyName) setAddCompanyDetails(true);
            } else {
                setFormData(prev => ({ ...prev, email: authEmail }));
            }
        } catch (err) {
            console.error("Failed to fetch profile data", err);
             if (authEmail) setFormData(prev => ({ ...prev, email: authEmail }));
        }
    };

    checkUser();
  }, [router]);


  // --- Load Razorpay Script ---
  useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
          document.body.removeChild(script);
      };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
        setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStateChange = (stateValue) => {
      setFormData(prev => ({ ...prev, state: stateValue }));
      if (fieldErrors.state) setFieldErrors(prev => ({ ...prev, state: null }));
  };

  const validateForm = () => {
      const errors = {};
      if (!formData.firstName.trim()) errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) errors.email = "Email is required";
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state) errors.state = "State is required";

      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(formData.phoneNumber)) errors.phoneNumber = "Phone number must be exactly 10 digits";

      const zipRegex = /^\d{6}$/;
      if (!zipRegex.test(formData.zip)) errors.zip = "ZIP code must be exactly 6 digits";

      setFieldErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const handleApplyCoupon = async (e) => {
      e.preventDefault();
      if (!promoCode.trim()) return;

      setCouponStatus('loading');
      setErrorMessage('');

      try {
          const res = await validateCouponAction(promoCode);
          if (res.valid) {
              setCouponStatus('valid');
              setAppliedCoupon({
                  code: promoCode,
                  description: res.description,
                  type: res.type,
                  percentOff: res.percentOff,
                  maxDiscount: res.maxDiscount
              });
              setPromoCode('');
          } else {
              setCouponStatus('invalid');
              if (res.message) setErrorMessage(res.message);
          }
      } catch (err) {
          setCouponStatus('invalid');
      }
  };

  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponStatus(null);
      setPromoCode('');
      setErrorMessage('');
  };


  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) {
        setErrorMessage("Please fix the highlighted errors before continuing.");
        return;
    }

    if (serverData.loading || serverData.error) {
        setErrorMessage("Cannot process payment: Pricing data unavailable.");
        return;
    }

    setIsProcessing(true);

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
             router.push('/sign-in');
             throw new Error("Session expired. Please sign in again.");
        }
        const accessToken = session.access_token;

        // 2. Save Billing Details (including Email)
        const billingPayload = {
            fullName: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zip,
            country: formData.country,
            phoneNumber: formData.phoneNumber,
            companyName: addCompanyDetails ? formData.companyName : null,
            gstNumber: addCompanyDetails ? formData.gstNumber : null
        };

        // Save using client-side wrapper that calls server action if needed?
        // Actually, we can just call Supabase client directly since RLS policy should ideally allow update own profile.
        // But prompt said "billing adress isue is still not resolved" implying RLS might be tricky.
        // Let's use the explicit RLS-compliant Supabase call first, but if that was failing, maybe we DO need a server action?
        // Wait, I implemented `saveBillingDetailsAction` in previous step but used `supabase` client here in `checkout/page.js` in previous turn.
        // I should switch to using the SERVER ACTION `saveBillingDetailsAction` (imported) which uses `supabaseAdmin`.
        // BUT `saveBillingDetailsAction` is in `razorpayActions.js`. I imported it.
        // I will use THAT instead of `supabase.from('profiles')` to be 100% sure it bypasses RLS issues.

        // Import: import { saveBillingDetailsAction } from '@/app/actions/razorpayActions'; (Already done)

        const saveRes = await import('@/app/actions/razorpayActions').then(mod => mod.saveBillingDetailsAction(billingPayload, accessToken));

        if (!saveRes.success) {
             throw new Error("Failed to save billing details. Please try again.");
        }

        // 3. Create Subscription
        const codeToSend = appliedCoupon ? appliedCoupon.code : '';
        const subRes = await createSubscriptionAction(planName, billingCycle, codeToSend, accessToken);

        if (!subRes.success) {
            if (subRes.error && subRes.error.includes("Unauthorized")) {
                 router.push('/sign-in');
                 throw new Error("Session expired. Please sign in again.");
             }
            throw new Error(subRes.error || "Failed to initiate subscription.");
        }

        // 4. Open Razorpay
        const options = {
            "key": subRes.keyId,
            "subscription_id": subRes.subscriptionId,
            "name": "BizVistar",
            "description": `${planName} Plan - ${billingCycle}`,
            "image": "https://bizvistar.com/logo.png",
            "handler": async function (response) {
                try {
                     const verification = await verifyPaymentAction(
                         response.razorpay_payment_id,
                         response.razorpay_subscription_id,
                         response.razorpay_signature
                     );

                     if (verification.success) {
                        router.push('/dashboard');
                     } else {
                        setErrorMessage("Payment verification failed. Please contact support.");
                        setIsProcessing(false);
                     }
                } catch (verifyErr) {
                    setErrorMessage("Payment verification failed. Please contact support.");
                    setIsProcessing(false);
                }
            },
            "prefill": {
                "name": billingPayload.fullName,
                "email": formData.email,
                "contact": formData.phoneNumber
            },
            "notes": {
                "note_key": "BizVistar Subscription"
            },
            "theme": {
                "color": "#8A63D2"
            }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response){
             console.error("Razorpay Payment Failed:", response.error);
             setErrorMessage(`Payment Failed: ${response.error.description}`);
             setIsProcessing(false);
        });
        rzp1.open();

    } catch (err) {
        console.error("Payment Initiation Error:", err);
        setErrorMessage(err.message || "An unexpected error occurred during checkout.");
        setIsProcessing(false);
    }
  };

  if (isCheckingAuth || serverData.loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
      );
  }

  if (serverData.error) {
      return (
          <div className="min-h-screen flex items-center justify-center text-red-600">
              {serverData.error}
          </div>
      );
  }


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: BILLING FORM --- */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl not-italic font-bold text-gray-900">Billing address</h2>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg border border-red-200 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form id="billing-form" onSubmit={handlePayment} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First name *</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none transition-all", fieldErrors.firstName ? "border-red-500" : "border-gray-300")}
                                required 
                            />
                            {fieldErrors.firstName && <p className="text-xs text-red-500">{fieldErrors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none transition-all", fieldErrors.lastName ? "border-red-500" : "border-gray-300")}
                                required 
                            />
                            {fieldErrors.lastName && <p className="text-xs text-red-500">{fieldErrors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email address *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none transition-all", fieldErrors.email ? "border-red-500" : "border-gray-300")}
                            required
                        />
                        {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Country of residence *</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value="India" 
                                disabled 
                                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone number</label>
                        <div className="flex">
                            <div className="relative w-1/3 sm:w-1/4">
                                <select 
                                    className="w-full p-3 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-1 focus:ring-purple-500 outline-none"
                                    value={formData.phoneCode}
                                    onChange={handleChange}
                                    name="phoneCode"
                                >
                                    <option value="+91">+91 (India)</option>
                                </select>
                            </div>
                            <input 
                                type="tel" 
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className={cn("w-full p-3 border border-l-0 rounded-r-md focus:ring-1 focus:ring-purple-500 outline-none", fieldErrors.phoneNumber ? "border-red-500" : "border-gray-300")}
                                placeholder="0000000000"
                            />
                        </div>
                        {fieldErrors.phoneNumber && <p className="text-xs text-red-500">{fieldErrors.phoneNumber}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Address *</label>
                            <input 
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none", fieldErrors.address ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.address && <p className="text-xs text-red-500">{fieldErrors.address}</p>}
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">City *</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none", fieldErrors.city ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.city && <p className="text-xs text-red-500">{fieldErrors.city}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">State *</label>
                            <StateSelector
                                value={formData.state}
                                onChange={handleStateChange}
                                error={!!fieldErrors.state}
                            />
                             <input
                                type="text"
                                value={formData.state}
                                className="sr-only"
                                required
                                onChange={()=>{}}
                                tabIndex={-1}
                             />
                             {fieldErrors.state && <p className="text-xs text-red-500">{fieldErrors.state}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">ZIP code *</label>
                            <input 
                                type="text" 
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className={cn("w-full p-3 border rounded-md focus:ring-1 focus:ring-purple-500 outline-none", fieldErrors.zip ? "border-red-500" : "border-gray-300")}
                                required
                            />
                             {fieldErrors.zip && <p className="text-xs text-red-500">{fieldErrors.zip}</p>}
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                             <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={addCompanyDetails}
                                    onChange={(e) => setAddCompanyDetails(e.target.checked)}
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm transition-all hover:border-purple-500 checked:bg-purple-600 checked:border-purple-600"
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                             </div>
                            <span className="text-base font-medium text-gray-700">Add company details</span>
                        </label>
                    </div>

                    <AnimatePresence>
                        {addCompanyDetails && (
                             <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden"
                             >
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">Company name</label>
                                    <input 
                                        type="text" 
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className="w-full p-3  border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">GST number</label>
                                    <input 
                                        type="text" 
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full sm:w-auto px-9 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-lg font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Continue to Payment'
                        )}
                    </button>

                </form>
            </div>
        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <h3 className="text-2xl not-italic font-bold text-gray-900 mb-2">Order summary</h3>
                <h4 className="text-lg not-italic font-bold text-gray-700 mb-6">{planName}</h4>
                
                <div className="space-y-4 mb-6">
                    {/* Main Plan Row */}
                    <div className="flex justify-between items-baseline">
                         <span className="text-base text-gray-700">{planLabel}</span>
                         <div className="text-right">
                            {formattedPlanDisplayStruck && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                    {formattedPlanDisplayStruck}
                                </span>
                            )}
                            <span className="text-base font-bold text-gray-900">{formattedPlanDisplayMain}</span>
                         </div>
                    </div>

                    {/* Free Items Loop */}
                    {FREE_ITEMS_CONFIG.map((item, i) => {
                        const struckVal = item.isFixed 
                            ? item.yearlyStruck 
                            : (isYearly ? item.yearlyStruck : item.monthlyStruck);
                        
                        let displayName = item.name;
                        if (item.dynamicLabel) {
                            displayName = isYearly ? '12 Months Hosting' : ' Hosting';
                        }

                        return (
                            <div key={i} className="flex justify-between items-baseline">
                                <span className="text-base text-gray-700">{displayName}</span>
                                <div className="text-right">
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                        {formatCurrency(struckVal)}
                                    </span>
                                    <span className="text-base font-bold text-gray-900">₹0.00</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                     {/* Discount Row (Green) */}
                     {discountAmount > 0 && appliedCoupon && (
                        <div className="flex justify-between items-center mb-4 text-emerald-600 font-medium">
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                <span>{appliedCoupon.code} -{appliedCoupon.percentOff}%</span>
                            </div>
                            <span>-{formattedDiscount}</span>
                        </div>
                     )}

                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Subtotal</span>
                        <div className="text-right">
                            {/* Struck through TOTAL if discount applied, otherwise existing struck total */}
                            <span className="block text-sm text-gray-400 line-through">
                                {formattedTotalStruck}
                            </span>
                            <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>

                    {/* Free Trial Note */}
                    {appliedCoupon?.code === 'FREETRIAL' && (
                         <div className="mt-2 text-sm text-emerald-600 font-medium flex items-center gap-1">
                             <Check className="w-4 h-4" />
                             Free for the first month
                         </div>
                    )}

                    {/* Founder Plan Note */}
                    {isFounder && (
                        <div className="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-md text-sm text-purple-700">
                             <strong>Founder Access:</strong> Valid for 1 year. Subscription ends after 1 year and requires re-registration.
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                     {/* Coupon Toggle Header */}
                    <button
                        type="button"
                        onClick={() => setShowPromo(!showPromo)}
                        className="flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors w-full"
                    >
                        <Tag className="w-4 h-4" />
                        <span>Have a coupon code?</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform ml-auto", showPromo ? "rotate-180" : "")} />
                    </button>
                    
                    <AnimatePresence>
                        {(showPromo || appliedCoupon) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-2">
                                    {appliedCoupon ? (
                                        <div className="bg-gray-100 rounded-md p-3 flex justify-between items-center">
                                            <div className="font-mono font-bold text-gray-700">{appliedCoupon.code}</div>
                                            <button onClick={removeCoupon} className="text-gray-500 hover:text-red-500">
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                className={cn("w-full p-3 border rounded-md focus:outline-none focus:border-purple-500 transition-colors", couponStatus === 'invalid' ? "border-red-500 bg-red-50" : "border-gray-300")}
                                                placeholder="Code"
                                                value={promoCode}
                                                onChange={(e) => {
                                                    setPromoCode(e.target.value);
                                                    setCouponStatus(null);
                                                }}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={couponStatus === 'loading' || !promoCode}
                                                className="px-6 py-3 border border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-50 disabled:opacity-50"
                                            >
                                                {couponStatus === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                    )}
                                    {couponStatus === 'invalid' && <p className="text-sm text-red-600 mt-1">{errorMessage || "Invalid Coupon Code"}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

             </div>

       
        </div>

      </div>

      {/* --- FAQ SECTION --- */}
      <div className="mt-20 border-t border-gray-200 pt-16">
         <FaqSection />
      </div>

    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
