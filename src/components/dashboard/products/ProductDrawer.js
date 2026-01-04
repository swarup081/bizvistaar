'use client';

import { X, TrendingUp, Package, Tag, DollarSign, Calendar } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ProductDrawer({ product, isOpen, onClose }) {
  if (!product) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content
          className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 overflow-y-auto focus:outline-none"
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 p-6 flex items-center justify-between z-10">
            <Dialog.Title className="text-lg font-bold text-gray-900">Product Details</Dialog.Title>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-8">

            {/* Product Header Info */}
            <div className="flex flex-col items-center text-center">
              <div className="h-32 w-32 rounded-2xl bg-gray-50 border border-gray-100 p-1 mb-4">
                <img
                  src={product.image_url || 'https://via.placeholder.com/150'}
                  alt={product.name}
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {product.categoryName}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                 <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                   <DollarSign size={14} /> Price
                 </div>
                 <div className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</div>
               </div>
               <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                 <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                   <Package size={14} /> Stock
                 </div>
                 <div className="text-lg font-bold text-gray-900">{product.stock}</div>
                 <div className={`text-xs font-medium ${
                   product.stockStatus === 'Out Of Stock' ? 'text-red-600' :
                   product.stockStatus === 'Low Stock' ? 'text-orange-600' : 'text-green-600'
                 }`}>
                   {product.stockStatus}
                 </div>
               </div>
            </div>

            {/* Analytics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#8A63D2]" />
                  Sales Performance
                </h3>
                <span className="text-xs text-gray-500">Last 7 Days</span>
              </div>

              <div className="h-64 w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={product.analytics}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8A63D2" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#8A63D2" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{fontSize: 10, fill: '#999'}}
                      tickFormatter={(val) => val.slice(5)} // Show MM-DD
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{fontSize: 10, fill: '#999'}}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8A63D2"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-900">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
