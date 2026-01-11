import CheckoutNavbar from '@/components/checkout/CheckoutNavbar';
import CheckoutFooter from '@/components/checkout/CheckoutFooter';

export default function CheckoutLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <CheckoutNavbar />
      <main>
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
}
