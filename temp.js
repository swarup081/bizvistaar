'use client';
import { useCart } from './cartContext.js'; // Import the cart hook
import { businessData } from './data.js'; // Import data to find category names

// --- Icons (no changes) ---
// This file holds all reusable components for the 'flara' template.

// --- Reusable SVG Icons ---
export const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

export const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);
export const ShippingIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 opacity-80"
      viewBox="0 0 100 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="50" cy="25" rx="40" ry="10" />
      <path d="M 10 25 L 10 115" />
      <path d="M 90 25 L 90 115" />
      <path d="M 10 115 A 40 10 0 0 0 90 115" />
      <path d="M 8 122 A 42 10 0 0 0 92 122" />
      <path d="M 12 45 A 38 8 0 0 0 88 45" />
      <line x1="50" y1="45" x2="50" y2="28" />
      <g>
        <path d="M 50 30 Q 46 22 50 10 Q 54 22 50 30 Z" />
        <path d="M 50 27 Q 48.5 22 50 16" />
      </g>
    </svg>
  );

// --- Header (no changes) ---
export const Header = ({ business, cartCount, onCartClick }) => ( /* ... */ );

// --- Product Card Component (HEAVILY MODIFIED) ---
export const ProductCard = ({ item, templateName }) => {
    const { addItem } = useCart(); // Get the addItem function from context
    
    // Function to handle adding to cart
    const handleAddToCart = (e) => {
        e.preventDefault(); // Stop the link from navigating
        e.stopPropagation(); // Stop any parent link events
        addItem(item); // Add this specific item
    };
    
    // Find the category name from the master list
    const category = businessData.categories.find(c => c.id === item.category);

    return (
        <div className="group text-center h-full flex flex-col justify-between border border-transparent hover:border-brand-primary/50 transition-all p-2">
            {/* Top section: Image, Title, Price */}
            <div>
                <a href={`/templates/${templateName}/product/${item.id}`} className="block bg-brand-primary overflow-hidden relative aspect-[4/5] h-80">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.src = 'https://placehold.co/600x750/CCCCCC/909090?text=Image+Missing'}
                    />
                </a>
                <div className="mt-5 px-1">
                    <h3 className="text-xl font-serif font-medium text-brand-text">
                        <a href={`/templates/${templateName}/product/${item.id}`} className="hover:text-brand-secondary">
                            {item.name}
                        </a>
                    </h3>
                    {category && (
                        <p className="text-brand-text opacity-60 text-sm mt-1">{category.name}</p>
                    )}
                    <p className="text-brand-text font-medium text-base mt-1">₹{item.price.toFixed(2)}</p>
                </div>
            </div>

            {/* Bottom section: Buttons (Show on hover) */}
            <div className="mt-4 px-1 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pb-2">
                 <a 
                    href={`/templates/${templateName}/product/${item.id}`}
                    className="w-full text-center block bg-brand-primary text-brand-text px-4 py-2.5 font-semibold text-sm hover:bg-brand-primary/80 transition-colors"
                >
                    View Details
                </a>
                <button 
                    onClick={handleAddToCart}
                    className="w-full text-center block bg-brand-secondary text-brand-bg px-4 py-2.5 font-semibold text-sm hover:opacity-80 transition-opacity"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

// --- Footer (no changes) ---
export const Footer = ({ businessData }) => ( /* ... */ );