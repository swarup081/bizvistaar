'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const FaqItem = ({ q, a }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left text-gray-900"
      >
        <span className="text-lg font-medium text-gray-900">{q}</span>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-300',
            isOpen ? 'rotate-180' : ''
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-10 text-base text-gray-600 leading-relaxed">
              {typeof a === 'string' ? <p>{a}</p> : a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FaqSection() {
  const faqs = [
    {
      q: 'What is a Premium plan?',
      a: 'A Premium plan is a subscription that gives you access to all of BizVistar\'s advanced features, including custom domain connection, removal of BizVistar branding, increased storage, and access to our "Done-for-You" services.'
    },
    {
      q: 'How do I get my free domain?',
      a: 'A free custom domain for one year is included with the "Growth" annual plan. After you upgrade, you will receive a voucher to claim your free domain, which you can register directly through your BizVistar dashboard.'
    },
    {
      q: 'Why do I need a custom domain?',
      a: 'A custom domain (e.g., yourbusiness.com) builds credibility, strengthens your brand, and makes it easier for customers to find you. It looks more professional than a free subdomain (e.g., yourbusiness.bizvistar.in).'
    },
    {
      q: 'How can I get my own personalized email address?',
      a: 'Once you have a custom domain, you can set up a personalized email address (e.g., info@yourbusiness.com) through our integration with Google Workspace or other third-party email providers.'
    },
    {
      q: 'Where can I find my billing information?',
      a: 'You can find all your billing information, including invoices and subscription details, in the "Billing & Payments" section of your account dashboard after you sign in.'
    },
    {
      q: 'What online payments are accepted?',
      a: 'We accept all major credit cards (Visa, MasterCard, American Express) as well as UPI, Net Banking, and other popular payment methods for our Indian customers.'
    },
    {
      q: 'How do I know if the Enterprise plan is right for my business?',
      a: 'Our Enterprise plan is designed for large-scale businesses with specific needs for custom features, dedicated support, and advanced security. If you have multiple locations or require custom integrations, our Enterprise team can help. Contact us for a consultation.'
    },
    {
      q: 'How do I contact the Enterprise team?',
      a: 'You can contact our Enterprise team by filling out the contact form on our "Enterprise" page or by reaching out to your dedicated account manager if you are an existing customer.'
    },
    {
      q: 'How does BizVistar handle security assessments/questionnaires?',
      a: (
        <p>
          For information on how BizVistar protects your data, compliance, certifications, GDPR and more, check out our{' '}
          <a href="#" className="text-blue-600 hover:underline">white paper</a>. 
          For security questions specific to your business, contact the Enterprise team using the form above.
        </p>
      )
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
      <div className="lg:col-span-1">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently asked questions
        </h2>
        <p className="text-lg text-gray-600">
          Haven't found what you're looking for? Try the{' '}
          <a href="#" className="text-blue-600 hover:underline">BizVistar Help Center</a>{' '}
          or{' '}
          <a href="#" className="text-blue-600 hover:underline">contact us</a>.
        </p>
      </div>
      
      <div className="lg:col-span-2">
        <div>
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </div>
  );
}
