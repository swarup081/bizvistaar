"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, Search, Layout, Type, Palette, Image as ImageIcon, Package } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { searchProducts } from '../../../actions/posActions';

export default function OfferPosterPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [badgeText, setBadgeText] = useState('50% OFF');
  const [customBadge, setCustomBadge] = useState('');
  const [layout, setLayout] = useState('modern'); // modern, minimal, bold
  const [isGenerating, setIsGenerating] = useState(false);

  const posterRef = useRef(null);

  // Load products on mount
  useEffect(() => {
    async function loadData() {
        const products = await searchProducts('');
        setAvailableProducts(products);
        setFilteredProducts(products);
    }
    loadData();
  }, []);

  // Filter Logic
  useEffect(() => {
    if (searchTerm.trim() === '') {
        setFilteredProducts(availableProducts);
    } else {
        setFilteredProducts(availableProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    }
  }, [searchTerm, availableProducts]);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    setIsGenerating(true);
    try {
        const dataUrl = await htmlToImage.toPng(posterRef.current, { quality: 1.0, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `offer-${selectedProduct?.name || 'promo'}.png`;
        link.href = dataUrl;
        link.click();
    } catch (err) {
        console.error("Failed to generate image", err);
        alert("Could not generate image. Please try again.");
    }
    setIsGenerating(false);
  };

  const badges = ["50% OFF", "SALE", "NEW ARRIVAL", "BEST SELLER", "RESTOCKED", "LIMITED"];

  return (
    <div className="flex h-full gap-8 overflow-hidden font-sans">

      {/* Left Sidebar: Product Selection */}
      <div className="w-[340px] flex flex-col gap-5 bg-white/80 backdrop-blur-md border border-white/20 p-5 rounded-3xl shadow-xl h-full overflow-hidden">
         <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 text-lg">1. Select Product</h2>
            <div className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{filteredProducts.length} items</div>
         </div>

         <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input
                 className="w-full pl-9 p-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white text-sm outline-none focus:ring-2 focus:ring-purple-100 shadow-inner transition-colors"
                 placeholder="Search products..."
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
             />
         </div>

         <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
             {filteredProducts.map(p => (
                 <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`group flex items-center gap-3 p-2.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedProduct?.id === p.id
                        ? 'bg-purple-50 border-purple-200 shadow-sm'
                        : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-100'
                    }`}
                 >
                     <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm">
                         {p.image_url ? (
                             <div className="w-full h-full bg-cover bg-center transition-transform group-hover:scale-110" style={{ backgroundImage: `url(${p.image_url})` }}></div>
                         ) : (
                             <div className="flex items-center justify-center w-full h-full text-gray-300"><Package size={20}/></div>
                         )}
                     </div>
                     <div className="min-w-0 flex-1">
                         <div className="text-sm font-bold text-gray-800 truncate">{p.name}</div>
                         <div className="text-xs font-medium text-gray-500">${p.price}</div>
                     </div>
                     {selectedProduct?.id === p.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm ring-2 ring-purple-100"></div>}
                 </div>
             ))}
             {filteredProducts.length === 0 && (
                 <div className="text-center py-10 text-gray-400 text-sm">
                     No products found.
                 </div>
             )}
         </div>
      </div>

      {/* Middle: Controls */}
      <div className="w-[300px] flex flex-col gap-6 py-4">
         {/* Badge Selection */}
         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
             <h2 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-wide">
                 <Type size={14} /> 2. Choose Badge
             </h2>
             <div className="flex flex-wrap gap-2 mb-4">
                 {badges.map(b => (
                     <button
                        key={b}
                        onClick={() => { setBadgeText(b); setCustomBadge(''); }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${badgeText === b ? 'bg-black text-white border-black shadow-md' : 'bg-gray-50 text-gray-600 border-transparent hover:border-gray-200'}`}
                     >
                         {b}
                     </button>
                 ))}
             </div>
             <input
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs bg-gray-50 focus:bg-white transition-colors outline-none focus:ring-1 focus:ring-black"
                placeholder="Type custom badge text..."
                value={customBadge}
                onChange={e => { setCustomBadge(e.target.value); setBadgeText(e.target.value); }}
             />
         </div>

          {/* Style Selection */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
             <h2 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-2 tracking-wide">
                 <Layout size={14} /> 3. Layout Style
             </h2>
             <div className="grid grid-cols-1 gap-3">
                 {['modern', 'minimal', 'bold'].map(l => (
                     <button
                        key={l}
                        onClick={() => setLayout(l)}
                        className={`flex items-center justify-between p-3.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                            layout === l
                            ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-sm'
                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                        }`}
                     >
                         {l} Layout
                         {layout === l && <div className="w-2 h-2 bg-purple-500 rounded-full ring-2 ring-purple-200"></div>}
                     </button>
                 ))}
             </div>
         </div>

         <div className="mt-auto">
            <button
                onClick={handleDownload}
                disabled={!selectedProduct || isGenerating}
                className="w-full py-4 bg-[#8A63D2] hover:bg-[#7750bf] text-white rounded-2xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
                {isGenerating ? 'Generating...' : <> <Download size={20} /> Download Poster </>}
            </button>
         </div>
      </div>

      {/* Right: Preview Canvas (Centered) */}
      <div className="flex-1 bg-gray-100/50 rounded-[2.5rem] p-8 border border-gray-200 overflow-hidden flex items-center justify-center relative shadow-inner">
          <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          {!selectedProduct ? (
              <div className="text-center text-gray-400 relative z-10 animate-in fade-in zoom-in duration-500">
                  <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                      <ImageIcon size={32} className="text-gray-300" />
                  </div>
                  <p className="font-bold text-gray-500">Select a product to preview</p>
                  <p className="text-sm mt-1">Choose from the list on the left</p>
              </div>
          ) : (
             <div
               ref={posterRef}
               className="h-[95%] aspect-[9/16] bg-white shadow-2xl relative overflow-hidden flex flex-col transform transition-all duration-500 rounded-sm"
             >
                 {/* Modern Layout */}
                 {layout === 'modern' && (
                     <>
                        <div className="h-[65%] w-full bg-cover bg-center relative" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}>
                            <div className="absolute top-6 left-6 bg-white px-5 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-lg uppercase text-black">
                                {badgeText}
                            </div>
                        </div>
                        <div className="flex-1 bg-white p-8 flex flex-col justify-center relative">
                            <h2 className="text-3xl font-extrabold text-gray-900 leading-tight mb-3">{selectedProduct.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{selectedProduct.description || 'Special offer available for a limited time. Don\'t miss out on this exclusive deal.'}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-[#8A63D2]">${selectedProduct.price}</span>
                                <span className="text-xl text-gray-400 line-through font-medium">${(selectedProduct.price * 1.2).toFixed(2)}</span>
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 text-center">
                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Powered by BizVistar</span>
                            </div>
                        </div>
                     </>
                 )}

                 {/* Minimal Layout */}
                 {layout === 'minimal' && (
                     <>
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                        <div className="relative z-10 h-full flex flex-col items-center justify-center p-10 text-center text-white">
                            <div className="border border-white/60 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.25em] mb-10 backdrop-blur-md">
                                {badgeText}
                            </div>
                            <h2 className="text-6xl font-serif mb-6 leading-none tracking-tight">{selectedProduct.name}</h2>
                            <div className="text-5xl font-light mb-12 opacity-90">${selectedProduct.price}</div>

                            <div className="absolute bottom-12 left-0 right-0 text-center">
                                <div className="w-16 h-px bg-white/60 mx-auto mb-4"></div>
                                <span className="text-[10px] font-medium text-white/70 uppercase tracking-[0.3em]">Link in Bio</span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-6 z-20">
                             <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">BizVistar</span>
                        </div>
                     </>
                 )}

                 {/* Bold Layout */}
                 {layout === 'bold' && (
                     <div className="h-full bg-[#FFD700] p-4 flex flex-col relative">
                        <div className="bg-white rounded-[2rem] h-full flex flex-col overflow-hidden shadow-inner border-4 border-black">
                            <div className="h-[60%] bg-cover bg-center border-b-4 border-black grayscale contrast-125" style={{ backgroundImage: `url(${selectedProduct.image_url})` }}></div>
                            <div className="flex-1 p-6 flex flex-col items-start justify-center bg-white relative">
                                <div className="absolute -top-6 right-6 bg-black text-[#FFD700] px-5 py-3 text-xl font-black uppercase transform rotate-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] border-2 border-white">
                                    {badgeText}
                                </div>
                                <h2 className="text-5xl font-black text-black leading-[0.85] mb-4 uppercase italic tracking-tighter">{selectedProduct.name}</h2>
                                <p className="text-4xl font-black text-gray-900 tracking-tighter bg-[#FFD700] px-2 inline-block transform -skew-x-12">ONLY ${selectedProduct.price}</p>
                            </div>
                        </div>
                        <div className="absolute bottom-1.5 left-0 right-0 text-center">
                            <span className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em]">Powered by BizVistar</span>
                        </div>
                     </div>
                 )}
             </div>
          )}
      </div>
    </div>
  );
}
