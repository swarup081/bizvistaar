import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import crypto from 'https://deno.land/std@0.177.0/node/crypto.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  const signature = req.headers.get('x-razorpay-signature');
  const body = await req.text();
  const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

  // Verify the webhook signature
  const expectedSignature = crypto
    .createHmac('sha256', razorpayWebhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  const event = JSON.parse(body);

  // Handle different Razorpay events
  switch (event.event) {
    case 'subscription.activated':
      // Update subscription status to 'active'
      await supabase
        .from('subscriptions')
        .update({ status: 'active' })
        .eq('razorpay_subscription_id', event.payload.subscription.id);
      break;

    case 'subscription.cancelled':
    case 'subscription.halted':
      // Update subscription status and unpublish websites
      const { data: subscription } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('razorpay_subscription_id', event.payload.subscription.id)
        .select('user_id')
        .single();

      if (subscription) {
        await supabase
          .from('websites')
          .update({ is_published: false })
          .eq('user_id', subscription.user_id);
      }
      break;

    // Add other cases as needed, e.g., payment.failed
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
})
