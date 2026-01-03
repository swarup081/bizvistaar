"use client";
import React from "react";
import {
  LayoutDashboard,
  Box,
  Folder,
  Users,
  PieChart,
  Bell,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // Assuming profile image might use this, or just a div placeholder

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#E0E7FF] font-sans">
      {/* Header */}
      <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
           <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <span className="text-xl font-bold">B</span>
           </div>
           <span className="text-xl font-bold text-gray-900">Bizvistar</span>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center gap-2">
           <Link href="/dashboard" className="flex items-center gap-2 rounded-xl bg-[#8A63D2] px-4 py-2 text-sm font-medium text-white shadow-md">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
           </Link>

           <Link href="/dashboard/orders" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Box className="h-4 w-4" />
              Orders
           </Link>

           <Link href="/dashboard/products" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Folder className="h-4 w-4" />
              Products
           </Link>

           <Link href="/dashboard/customers" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Users className="h-4 w-4" />
              Customers
           </Link>

           <Link href="/dashboard/analytics" className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <PieChart className="h-4 w-4" />
              Analytics
           </Link>
        </nav>

        {/* Right: User Controls */}
        <div className="flex items-center gap-4">
           <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <Bell className="h-5 w-5" />
           </button>
           <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900">
              <MessageCircle className="h-5 w-5" />
           </button>
           <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
              {/* Profile Placeholder for Noah */}
              <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-bold">
                N
              </div>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
