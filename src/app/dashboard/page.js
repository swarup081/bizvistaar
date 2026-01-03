"use client";
import React from "react";
import { Search, Upload, SlidersHorizontal, Coins, ShoppingBag, DollarSign, Mail } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesSummaryChart from "@/components/dashboard/SalesSummaryChart";
import RecentSalesTable from "@/components/dashboard/RecentSalesTable";
import UserGrowthChart from "@/components/dashboard/UserGrowthChart";
import BestSellers from "@/components/dashboard/BestSellers";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4 font-sans">
      {/* Main Content Area (Left & Center) */}
      <div className="xl:col-span-3 flex flex-col gap-6">

        {/* Greeting & Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Good Morning, Noah!</h1>
            <p className="text-gray-500 font-medium mt-1">Here's what's happening with your store today.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search product..."
                  className="h-10 w-64 rounded-full border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] shadow-sm"
                />
             </div>
             <button className="flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                <Upload className="h-4 w-4" />
                Export CSV
             </button>
             <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                <SlidersHorizontal className="h-5 w-5" />
             </button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
               title="Sales"
               value="$10,845,329.00"
               change="17.8%"
               period="vs. prior 30 days"
               icon={Coins}
            />
            <StatCard
               title="Units"
               value="6,238"
               change="1.63%"
               period="vs. prior 30 days"
               icon={ShoppingBag}
            />
            <StatCard
               title="Average Order Value"
               value="$366.71"
               change="4.45%"
               period="vs. prior 30 days"
               icon={DollarSign}
            />
        </div>

        {/* Sales Summary Chart */}
        <SalesSummaryChart />

        {/* Recent Sales Table */}
        <RecentSalesTable />
      </div>

      {/* Right Column (Sidebar) */}
      <div className="xl:col-span-1 flex flex-col gap-6 sticky top-6 h-fit">
         {/* User Growth */}
         <div className="h-[400px]">
             <UserGrowthChart />
         </div>

         {/* Top 3 Best Sellers */}
         <BestSellers />

         {/* Contact Us Button */}
         <div className="mt-auto">
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8A63D2] py-4 text-white shadow-lg hover:bg-[#7c58bd] transition-colors font-bold">
                <Mail className="h-5 w-5" />
                Contact Us
            </button>
         </div>
      </div>
    </div>
  );
}
