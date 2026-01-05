"use client";
import React from 'react';
import { Receipt, FileImage, Truck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function AppsPage() {
  const apps = [
    {
      id: 'quick-invoice',
      name: 'Quick Invoice',
      description: 'Create professional invoices for walk-in or offline customers instantly. Auto-syncs with inventory.',
      icon: Receipt,
      href: '/dashboard/apps/quick-invoice',
      color: 'bg-blue-100 text-blue-600',
      gradient: 'from-blue-50 to-white'
    },
    {
      id: 'offer-poster',
      name: 'Offer Poster',
      description: 'Generate beautiful promotional images for Instagram Stories and social media in seconds.',
      icon: FileImage,
      href: '/dashboard/apps/offer-poster',
      color: 'bg-purple-100 text-purple-600',
      gradient: 'from-purple-50 to-white'
    },
    {
        id: 'shipping-labels',
        name: 'Shipping Labels',
        description: 'Generate and print shipping labels for your orders directly from the Orders page.',
        icon: Truck,
        href: '/dashboard/orders', // Links to Orders page as requested
        color: 'bg-orange-100 text-orange-600',
        gradient: 'from-orange-50 to-white'
    },
  ];

  return (
    <div className="flex flex-col gap-10 font-sans p-2 relative">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#8A63D2] to-[#6b42b5] p-10 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold w-fit border border-white/30">
                  <Zap size={14} className="text-yellow-300" fill="currentColor" />
                  <span>Power Tools</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight">Apps & Tools</h1>
              <p className="text-purple-100 text-lg max-w-xl leading-relaxed opacity-90">
                Boost your business productivity with our suite of built-in tools. Generate invoices, create marketing assets, and manage logistics.
              </p>
          </div>

          {/* Decorative Circles */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-20 w-40 h-40 bg-purple-400/30 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <Link
            key={app.id}
            href={app.href}
            className={`group flex flex-col gap-4 p-8 rounded-[2rem] bg-gradient-to-br ${app.gradient} border border-white/40 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${app.color} shadow-sm group-hover:scale-110 transition-transform duration-500 z-10`}>
              <app.icon size={32} strokeWidth={2.5} />
            </div>
            <div className="z-10">
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{app.name}</h3>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed font-medium">
                {app.description}
              </p>
            </div>
            <div className="mt-auto pt-6 flex items-center text-sm font-black text-gray-900 group-hover:text-purple-600 transition-colors z-10">
              Open Tool <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
