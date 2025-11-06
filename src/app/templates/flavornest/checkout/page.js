'use client';

import { useCart } from '../cartContext.js';

export default function CheckoutPage() {
    
    const { cartDetails, subtotal, shipping, total } = useCart();

    return (
        <div className="container mx-auto px-6 py-20">
            <h1 className="text-5xl font-bold text-brand-secondary font-serif text-center mb-12">Checkout</h1>
            
            {cartDetails.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl text-brand-text/80">Your cart is empty.</p>
                    <a 
                        href="/templates/flavornest/shop"
                        className="mt-8 inline-block btn btn-primary px-8 py-3"
                    >
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
                    
                    {/* Shipping Details Form */}
                    <div className="font-sans">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Shipping Details</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">First Name</label>
                                    <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">Last Name</label>
                                    <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Address</label>
                                <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">City</label>
                                <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">State</label>
                                    <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-brand-text/80 mb-1">ZIP Code</label>
                                    <input type="text" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-brand-text/80 mb-1">Phone</label>
                                <input type="tel" className="w-full p-3 bg-white border border-brand-text/30 rounded-md focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary outline-none" />
                            </div>
                        </form>
                    </div>
                    
                    {/* Order Summary */}
                    <div className="bg-brand-primary p-8 rounded-lg">
                        <h2 className="text-2xl font-serif font-semibold text-brand-text mb-6">Your Order</h2>
                        
                        <div className="space-y-4 border-b border-brand-text/20 pb-4">
                            {cartDetails.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white rounded" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-brand-text">{item.name}</h3>
                                        <p className="text-sm text-brand-text/70">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-brand-text">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="space-y-2 border-b border-brand-text/20 py-4">
                            <div className="flex justify-between text-brand-text/80">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                             <div className="flex justify-between text-brand-text/80">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                        </div>
                        
                         <div className="flex justify-between text-brand-text font-bold text-xl py-4">
                            <span>Total</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        
                        <button className="w-full mt-4 h-12 btn btn-secondary">
                            Place Order (COD)
                        </button>
                        <p className="text-xs text-brand-text/60 text-center mt-2">Payment will be collected upon delivery.</p>
                    </div>
                </div>
            )}
        </div>
    );
}