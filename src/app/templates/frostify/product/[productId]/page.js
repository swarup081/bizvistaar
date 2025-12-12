'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTemplateContext } from '../../templateContext.js';
import { useCart } from '../../cartContext.js';
import { ProductCard } from '../../components.js';

export default function FrostifyProductPage() {
    const { productId } = useParams();
    const { businessData } = useTemplateContext();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const product = businessData.allProducts.find(p => p.id.toString() === productId);

    if (!product) return <div className="py-32 text-center text-[var(--color-primary)]">Product not found.</div>;

    // Related products (same category)
    const relatedProducts = businessData.allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                
                {/* Main Product Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                    <div className="bg-[#F9F4F6] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-lg aspect-square">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div>
                        <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-[0.2em]">
                            {businessData.categories.find(c => c.id === product.category)?.name}
                        </span>
                        <h1 className="text-5xl font-serif text-[var(--color-primary)] mt-4 mb-6">{product.name}</h1>
                        <p className="text-3xl text-[var(--color-primary)] font-bold mb-8">${product.price.toFixed(2)}</p>
                        <p className="text-gray-600 leading-relaxed mb-10 text-lg">{product.description}</p>
                        
                        <div className="flex gap-4">
                            <div className="flex items-center border border-[var(--color-primary)] rounded-full px-2">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-[var(--color-primary)] font-bold">-</button>
                                <span className="px-3 py-2 text-[var(--color-primary)] font-bold w-8 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 text-[var(--color-primary)] font-bold">+</button>
                            </div>
                            <button 
                                onClick={() => addToCart(product, quantity)}
                                className="flex-grow bg-[var(--color-primary)] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="border-t border-gray-100 pt-16">
                        <h2 className="text-3xl font-serif text-[var(--color-primary)] text-center mb-12">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(p => <ProductCard key={p.id} item={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}