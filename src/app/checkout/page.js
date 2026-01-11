'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import FaqSection from '@/components/checkout/FaqSection';
import { AnimatePresence, motion } from 'framer-motion';
// import { createClient } from '@/lib/supabaseClient';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planName = searchParams.get('plan') || 'Pro';
  const billingCycle = searchParams.get('billing') || 'monthly';
  const price = searchParams.get('price') || '0.00';

  // --- Auth Check (Optional but good for UX) ---
  // You might want to do a server-side check or a client-side effect to redirect if not logged in
  // For now, assuming middleware or previous flow handled it, but let's add a quick check.
  // actually the prompt says "if user click a plan and is not sign in he need to do it first".
  // This logic is best handled in the Plan selection page or middleware.
  // I will assume the user is here because they are signed in or redirected back.

  // --- Form State ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'India', // Fixed
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
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  // --- Dates for Legal Text ---
  const today = new Date();
  const renewalDate = new Date(today);
  if (billingCycle === 'yearly') {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  } else {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  }
  const formattedRenewalDate = renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Format Price
  const numericPrice = parseFloat(price);
  const formattedPrice = numericPrice.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
  });

  // Fake Original Price for Strikethrough (e.g., 25% markup if not provided)
  const fakeOriginalPrice = (numericPrice * 1.25).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
  });

   // Upper limit for e-mandate
   const eMandateLimit = 15000;
   const formattedLimit = eMandateLimit.toLocaleString('en-IN', {
       style: 'currency',
       currency: 'INR',
       minimumFractionDigits: 0
   });

   // Free Items List
   const freeItems = [
     { name: 'Priority Support', original: '2,400.00' },
     { name: 'Custom Domain Connection', original: '999.00' },
     { name: 'Cloud Server Hosting', original: '499.00' },
     { name: 'SSL Security (https)', original: '199.00' },
     { name: 'One-Time Setup Fee', original: '999.00' },
   ];

   const planLabel = billingCycle === 'yearly' ? '12-month plan' : 'Monthly plan';

   // Calculate Total Struck Price (Plan Original + Free Items Original)
   // Just for visual effect, rough calculation
   const totalStruck = (numericPrice * 1.25 + 2400 + 999 + 499 + 199 + 999).toLocaleString('en-IN', {
       style: 'currency',
       currency: 'INR',
       minimumFractionDigits: 2
   });


  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- LEFT COLUMN: BILLING FORM --- */}
        <div className="lg:col-span-2 space-y-8">

            {/* Step 1: Billing Address (Boxed) */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                        1
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Billing address</h2>
                </div>

                <form id="billing-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">First name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Swarup"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Last name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Das"
                                required
                            />
                        </div>
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
                             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Phone number</label>
                        <div className="flex">
                            <div className="relative w-1/3 sm:w-1/4">
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-l-md appearance-none bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    value={formData.phoneCode}
                                    onChange={handleChange}
                                    name="phoneCode"
                                >
                                    <option value="+91">+91 (India)</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 border-l-0 rounded-r-md focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="00000000"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Address *</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">State *</label>
                            <div className="relative">
                                <select
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                                    required
                                >
                                    <option value="" disabled>Select State</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    {/* Add more states as needed */}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">ZIP code *</label>
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={addCompanyDetails}
                                onChange={(e) => setAddCompanyDetails(e.target.checked)}
                                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-base font-medium text-gray-700">Add company details</span>
                            <HelpCircle className="w-4 h-4 text-purple-600" />
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
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-2 py-2">
                                    <label className="text-sm font-semibold text-gray-700">GST number</label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                             </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-md shadow-md transition-colors"
                    >
                        Continue
                    </button>

                </form>
            </div>

            {/* "Payment" Section Visual Placeholder (Inactive/Next Step) */}
            <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 opacity-60">
                <div className="flex items-center gap-4">
                     <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 font-bold text-sm">
                        2
                    </div>
                    <h2 className="text-2xl font-bold text-gray-400">Payment</h2>
                </div>
            </div>

        </div>

        {/* --- RIGHT COLUMN: ORDER SUMMARY --- */}
        <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-24">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order summary</h3>
                <h4 className="text-lg font-bold text-gray-700 mb-6">{planName}</h4>

                <div className="space-y-4 mb-6">
                    {/* Main Plan Row */}
                    <div className="flex justify-between items-baseline">
                         <span className="text-base text-gray-700">{planLabel}</span>
                         <div className="text-right">
                            <span className="text-sm text-gray-400 line-through mr-2">{fakeOriginalPrice}</span>
                            <span className="text-base font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>

                    {/* 12 Months Hosting (Requested Item) */}
                    <div className="flex justify-between items-baseline">
                         <span className="text-base text-gray-700">12 Months Hosting</span>
                         <div className="text-right">
                            <span className="text-sm text-gray-400 line-through mr-2">₹5,988.00</span>
                            <span className="text-base font-bold text-gray-900">₹0.00</span>
                         </div>
                    </div>

                    {/* Free Items Loop */}
                    {freeItems.map((item, i) => (
                        <div key={i} className="flex justify-between items-baseline">
                            <span className="text-base text-gray-700">{item.name}</span>
                            <div className="text-right">
                                <span className="text-sm text-gray-400 line-through mr-2">₹{item.original}</span>
                                <span className="text-base font-bold text-gray-900">₹0.00</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <div className="text-right">
                            <span className="block text-sm text-gray-400 line-through">{totalStruck}</span>
                            <span className="text-3xl font-bold text-gray-900">{formattedPrice}</span>
                         </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => setShowPromo(!showPromo)}
                        className="text-purple-600 font-semibold hover:underline focus:outline-none"
                    >
                        Have a coupon code?
                    </button>

                    <AnimatePresence>
                        {showPromo && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex gap-2 pt-2">
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-purple-500"
                                        placeholder="Code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button className="px-4 py-2 border border-purple-600 text-purple-600 font-semibold rounded-md hover:bg-purple-50">
                                        Apply
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

             </div>

             {/* --- LEGAL TEXT MOVED HERE --- */}
             <div className="mt-6 text-xs text-gray-500 leading-relaxed space-y-4">
                <p>
                    By purchasing, you accept the <Link href="/terms" className="underline text-gray-600">Terms and Conditions</Link> and <Link href="/privacy" className="underline text-gray-600">Privacy Policy</Link> and acknowledge reading the Privacy Policy.
                </p>
                <p>
                    You also agree to the automatic renewal of your subscription on a {billingCycle} basis for {formattedPrice} starting on {formattedRenewalDate}, which can be disabled at any time through your account. Any eligible tax exemptions and discounts will be applied when you&apos;re charged for your next renewal payment.
                </p>
                <p>
                    In accordance with RBI guidelines, your card details will be saved securely for future purchases and subscription renewals. An e-mandate will be created for a maximum amount of {formattedLimit}, but you&apos;ll only be charged the amount of your purchase.
                </p>
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
