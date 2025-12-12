'use client';

import { useCart } from '../cartContext.js';

export default function FrostifyCheckoutPage() {
    const { cartDetails, total } = useCart();

    return (
        <div className="bg-[#F9F4F6] min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-6xl">
                <h1 className="text-4xl font-serif text-[var(--color-primary)] text-center mb-12">Checkout</h1>

                {cartDetails.length === 0 ? (
                    <div className="text-center bg-white p-12 rounded-3xl shadow-sm">
                        <p className="text-xl text-[var(--color-primary)] mb-6">Your cart is empty.</p>
                        <a href="/templates/frostify/shop" className="inline-block bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary)] transition-colors">
                            Return to Shop
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm">
                            <h2 className="text-xl font-bold text-[var(--color-primary)] mb-6 uppercase tracking-widest">Delivery Details</h2>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="First Name" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                                    <input type="text" placeholder="Last Name" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                                </div>
                                <input type="text" placeholder="Address" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="City" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                                    <input type="text" placeholder="Zip Code" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                                </div>
                                <input type="tel" placeholder="Phone Number" className="w-full bg-[#F9F4F6] px-4 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)]" />
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[var(--color-primary)] text-white p-8 rounded-3xl shadow-lg h-fit">
                            <h2 className="text-xl font-bold mb-6 uppercase tracking-widest border-b border-white/20 pb-4">Your Order</h2>
                            <div className="space-y-4 mb-6">
                                {cartDetails.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white overflow-hidden">
                                                <img src={item.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-serif text-lg leading-none">{item.name}</p>
                                                <p className="text-xs opacity-70">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/20 pt-6 mt-6">
                                <div className="flex justify-between text-2xl font-serif">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button className="w-full mt-8 bg-white text-[var(--color-primary)] py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-secondary)] hover:text-white transition-colors">
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}