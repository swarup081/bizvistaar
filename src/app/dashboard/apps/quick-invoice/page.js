"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Trash2, Printer, Save, Loader2, Package, RefreshCw } from 'lucide-react';
import { createQuickInvoiceOrder, searchProducts, getShopDetails, getCategories } from '../../../actions/posActions';
import jsPDF from 'jspdf';
import Link from 'next/link';

export default function QuickInvoicePage() {
  // State
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Product Grid State
  const [searchTerm, setSearchTerm] = useState('');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Business Details (for Invoice)
  const [businessDetails, setBusinessDetails] = useState({
    name: 'My Shop',
    address: '',
    logo: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
        const [products, fetchedCategories] = await Promise.all([
            searchProducts(''),
            getCategories()
        ]);
        setAvailableProducts(products);
        setFilteredProducts(products);
        setCategories(fetchedCategories);

        // Load Details
        const cached = localStorage.getItem('biz_invoice_settings');
        if (cached) {
            setBusinessDetails(JSON.parse(cached));
        } else {
            const data = await getShopDetails();
            if (data && data.website_data) {
            setBusinessDetails(prev => ({
                ...prev,
                name: data.website_data.name || data.site_slug || 'My Shop',
            }));
            }
        }
    } catch (e) {
        console.error("Load Data Error", e);
    } finally {
        setIsLoading(false);
    }
  };

  // Load business details & products on mount
  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let filtered = availableProducts;

    // 1. Search
    if (searchTerm.trim() !== '') {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 2. Category
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => String(p.category_id) === String(selectedCategory));
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, availableProducts]);

  const addToCart = (product) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        image: product.image_url
      }];
    });
  };

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.productId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.productId !== id));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // PDF Generation
  const generatePDF = (orderNumber) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20);
    doc.text(businessDetails.name || "Invoice", 20, 20);

    doc.setFontSize(10);
    doc.text(businessDetails.address || "", 20, 30);

    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 20, 20, { align: 'right' });
    doc.text(`Order #${orderNumber || 'DRAFT'}`, pageWidth - 20, 26, { align: 'right' });

    // Customer
    doc.line(20, 40, pageWidth - 20, 40);
    doc.setFontSize(12);
    doc.text("Bill To:", 20, 50);
    doc.setFontSize(10);
    doc.text(customerName || "Walk-in Customer", 20, 56);
    if (customerAddress) doc.text(customerAddress, 20, 62);

    // Table Header
    let y = 80;
    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, pageWidth - 40, 8, 'F');
    doc.font = "helvetica";
    doc.setFont(undefined, 'bold');
    doc.text("Item", 25, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 145, y);
    doc.text("Total", 170, y);

    // Items
    y += 10;
    doc.setFont(undefined, 'normal');
    items.forEach(item => {
        doc.text(item.name.substring(0, 40), 25, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(`$${item.price.toFixed(2)}`, 145, y);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, y);
        y += 8;
    });

    // Total
    y += 5;
    doc.line(20, y, pageWidth - 20, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Total: $${totalAmount.toFixed(2)}`, pageWidth - 25, y, { align: 'right' });

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'italic');
    doc.setTextColor(150);
    doc.text("Powered by BizVistar", pageWidth / 2, pageWidth - 10, { align: 'center' });

    doc.save(`Invoice_${orderNumber || 'Draft'}.pdf`);
  };

  const handleSaveAndPrint = async () => {
    if (items.length === 0) return alert("Please add items first.");
    if (!customerName) return alert("Please enter customer name.");

    setIsSaving(true);

    // 1. Save to DB
    const res = await createQuickInvoiceOrder({
        customerName,
        customerEmail,
        customerAddress,
        items,
        totalAmount
    });

    if (res.success) {
        generatePDF(res.orderNumber);
        setItems([]);
        setCustomerName('');
        alert("Order saved and Invoice generated!");
    } else {
        alert("Error saving order: " + res.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="h-full flex gap-6 overflow-hidden font-sans">
        {/* Left: Product Grid (3 columns) */}
        <div className="flex-1 flex flex-col gap-6 h-full overflow-hidden">
             {/* Header & Search */}
             <div className="flex flex-col gap-4 bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-sm border border-white/40">
                 <div className="flex items-center justify-between">
                     <h1 className="text-2xl font-black text-gray-800 tracking-tight">POS Lite</h1>
                     <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                         <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                     </button>
                 </div>

                 <div className="flex items-center gap-3">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-purple-100 shadow-inner"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                     </div>
                 </div>

                 {/* Categories */}
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                     <button
                         onClick={() => setSelectedCategory('all')}
                         className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
                     >
                         All Items
                     </button>
                     {categories.map(c => (
                         <button
                             key={c.id}
                             onClick={() => setSelectedCategory(c.id)}
                             className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === c.id ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
                         >
                             {c.name}
                         </button>
                     ))}
                 </div>
             </div>

             {/* Grid */}
             <div className="flex-1 overflow-y-auto pr-2 pb-20">
                 {isLoading ? (
                     <div className="flex items-center justify-center h-40">
                         <Loader2 className="animate-spin text-purple-500" size={32} />
                     </div>
                 ) : filteredProducts.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                         <Package size={48} className="opacity-20" />
                         <p>No products found.</p>
                         <button onClick={loadData} className="text-purple-600 text-sm font-bold hover:underline">Refresh Inventory</button>
                     </div>
                 ) : (
                     <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                        {filteredProducts.map(p => (
                            <div
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-purple-100 hover:-translate-y-1"
                            >
                                <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden relative mb-3">
                                    {p.image_url ? (
                                        <div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${p.image_url})` }}></div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package size={32} />
                                        </div>
                                    )}
                                    {/* Add Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                        <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Add to Order
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-black text-gray-900 shadow-sm border border-white/50">
                                        ${p.price}
                                    </div>
                                </div>
                                <div className="px-1">
                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium mt-0.5">{p.stock === -1 ? 'Unlimited' : `${p.stock} in stock`}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}
             </div>
        </div>

        {/* Right: Cart & Form (Fixed Width) */}
        <div className="w-[420px] flex flex-col gap-4 h-full bg-white/90 backdrop-blur-2xl border-l border-white/60 shadow-[0_0_40px_rgba(0,0,0,0.05)] p-6 rounded-l-[2rem] -mr-10 pr-14 overflow-y-auto">

            <div className="flex items-center justify-between pb-2">
                <h2 className="font-black text-xl text-gray-800">Current Order</h2>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-bold">{items.length} Items</span>
            </div>

            {/* Customer Form */}
            <div className="space-y-3 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 focus-within:border-purple-200 focus-within:ring-4 focus-within:ring-purple-50 transition-all">
                <input
                   className="w-full bg-transparent border-b border-gray-200 p-2 text-sm font-medium outline-none placeholder:text-gray-400 focus:border-purple-500"
                   placeholder="Customer Name *"
                   value={customerName}
                   onChange={e => setCustomerName(e.target.value)}
                />
                 <input
                   className="w-full bg-transparent border-b border-gray-200 p-2 text-sm font-medium outline-none placeholder:text-gray-400 focus:border-purple-500"
                   placeholder="Email (Optional)"
                   value={customerEmail}
                   onChange={e => setCustomerEmail(e.target.value)}
                />
                 <textarea
                   className="w-full bg-transparent border-none p-2 text-sm font-medium outline-none placeholder:text-gray-400 resize-none"
                   placeholder="Add Billing Address..."
                   rows={2}
                   value={customerAddress}
                   onChange={e => setCustomerAddress(e.target.value)}
                />
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-3 min-h-[200px] pr-2">
                {items.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full text-gray-300 space-y-3">
                         <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                             <Package size={24} />
                         </div>
                         <span className="text-sm font-medium">Cart is empty</span>
                     </div>
                )}
                {items.map(item => (
                    <div key={item.productId} className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-50 group hover:border-purple-100 transition-colors">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${item.image})` }}></div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-sm text-gray-800 leading-tight line-clamp-2">{item.name}</h4>
                                <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="text-xs font-bold text-gray-500">${item.price}</div>
                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                    <button onClick={() => updateQuantity(item.productId, -1)} className="hover:text-purple-600 transition-colors text-lg leading-none mb-0.5">-</button>
                                    <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, 1)} className="hover:text-purple-600 transition-colors text-lg leading-none mb-0.5">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            <div className="mt-auto space-y-4 pt-6 border-t border-gray-100/50">
                <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-medium">Total Amount</span>
                    <span className="text-3xl font-black text-gray-900 tracking-tight">${totalAmount.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleSaveAndPrint}
                    disabled={isSaving || items.length === 0}
                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] hover:-translate-y-1"
                >
                    {isSaving ? <Loader2 className="animate-spin" /> : <Printer size={20} />}
                    Generate Invoice
                </button>

                {/* Invoice Settings Toggle (Simplified) */}
                <details className="group">
                    <summary className="list-none text-xs text-center text-gray-400 cursor-pointer hover:text-purple-600 transition-colors font-medium select-none">
                        Edit Shop Details & Logo
                    </summary>
                    <div className="mt-3 space-y-2 bg-white p-3 rounded-xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                         <input
                           className="w-full p-2 border border-gray-100 rounded-lg text-xs"
                           value={businessDetails.name}
                           onChange={e => {
                               const v = {...businessDetails, name: e.target.value};
                               setBusinessDetails(v);
                               localStorage.setItem('biz_invoice_settings', JSON.stringify(v));
                           }}
                           placeholder="Shop Name"
                        />
                         <input
                           className="w-full p-2 border border-gray-100 rounded-lg text-xs"
                           value={businessDetails.address}
                           onChange={e => {
                               const v = {...businessDetails, address: e.target.value};
                               setBusinessDetails(v);
                               localStorage.setItem('biz_invoice_settings', JSON.stringify(v));
                           }}
                           placeholder="Address"
                        />
                    </div>
                </details>
            </div>
        </div>
    </div>
  );
}
