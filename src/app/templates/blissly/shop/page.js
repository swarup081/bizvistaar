'use client';

import { useState } from 'react';
import { businessData } from '../data.js';
import { ProductCard } from '../components.js';

export default function ShopPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    
    const allProducts = businessData.allProducts; 
    
    const categories = [
        { id: 'all', name: 'All' }, 
        ...businessData.categories
    ];
    
    const filteredProducts = selectedCategoryId === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === selectedCategoryId);

    return (
        <div className="container mx-auto px-6 py-24">
            <h1 className="text-5xl md:text-6xl font-bold text-brand-text font-serif text-center mb-16">Shop Our Collection</h1>
            
            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-3 mb-16">
                {categories.map(category => (
                    <button 
                        key={category.id}
                        onClick={() => setSelectedCategoryId(category.id)}
                        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategoryId === category.id 
                                ? 'bg-brand-secondary text-brand-bg' 
                                : 'bg-brand-primary text-brand-text hover:bg-brand-secondary/20'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            
            {/* Products Grid - UPDATED GAPS & COLS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
                {filteredProducts.map(item => (
                    <ProductCard 
                        key={item.id} 
                        item={item}
                        templateName="blissly"
                    />
                ))}
            </div>

            {/* "No products" message */}
            {filteredProducts.length === 0 && (
                <p className="text-center text-brand-text/70 text-lg mt-12 col-span-full">No products found in this category.</p>
            )}
        </div>
    );
}