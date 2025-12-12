'use client';

import { useState } from 'react';
import { useTemplateContext } from '../templateContext.js';
import { ProductCard } from '../components.js';

export default function FrostifyShopPage() {
    const { businessData } = useTemplateContext();
    const [filter, setFilter] = useState('all');

    const allProducts = businessData.allProducts;
    const categories = [{ id: 'all', name: 'All Treats' }, ...businessData.categories];

    const filteredProducts = filter === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === filter);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[var(--color-secondary)] text-xs font-bold uppercase tracking-[0.2em]">Freshly Baked</span>
                    <h1 className="text-5xl font-serif text-[var(--color-primary)] mt-4">Our Menu</h1>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                                filter === cat.id 
                                    ? 'bg-[var(--color-primary)] text-white' 
                                    : 'bg-[#F9F4F6] text-[var(--color-primary)] hover:bg-[var(--color-accent)]/20'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} item={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <p className="text-center text-gray-500 mt-12">No delicious treats found in this category.</p>
                )}
            </div>
        </div>
    );
}