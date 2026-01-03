"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

const salesData = [
  {
    id: 1,
    product: "Nike ZoomX",
    category: "Running Shoes",
    orders: 42,
    price: "$190",
    amount: "$4,860.00",
    status: "Complete",
  },
  {
    id: 2,
    product: "Nike Air Zoom Pegasus 40",
    category: "Running Shoes",
    orders: 67,
    price: "$180",
    amount: "$5,600.00",
    status: "Progress",
  },
  {
    id: 3,
    product: "Nike Court Air Zoom Vapor",
    category: "Running Shoes",
    orders: 59,
    price: "$220",
    amount: "$9,590.00",
    status: "Waiting",
  },
  {
    id: 4,
    product: "Adidas Ultraboost Light",
    category: "Running Shoes",
    orders: 35,
    price: "$190",
    amount: "$3,850.00",
    status: "Complete",
  },
  // Adding more rows to demonstrate scroll
  {
    id: 5,
    product: "Nike Air Max 270",
    category: "Running Shoes",
    orders: 22,
    price: "$160",
    amount: "$3,520.00",
    status: "Complete",
  },
  {
    id: 6,
    product: "Nike Revolution 6",
    category: "Running Shoes",
    orders: 45,
    price: "$70",
    amount: "$3,150.00",
    status: "Progress",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Complete: "bg-green-50 text-green-600",
    Progress: "bg-blue-50 text-blue-600",
    Waiting: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold font-sans ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default function RecentSalesTable() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-gray-900 font-sans">Recent Sales</h3>
        <div className="relative">
             <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans">
                This Week
                <ChevronDown className="h-4 w-4 text-gray-500" />
             </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 flex-1 min-h-[300px]">
        <div className="h-full overflow-y-auto overflow-x-auto max-h-[400px]">
            <table className="w-full min-w-[700px] border-collapse text-left font-sans">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
                <th className="w-8 py-4 pl-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-[#8A63D2]" /></th>
                <th className="py-4 pl-2">Product</th>
                <th className="py-4">Category</th>
                {/* Platform column removed */}
                <th className="py-4">Total Orders</th>
                <th className="py-4 min-w-[100px]">Price</th>
                <th className="py-4 min-w-[120px]">Amount</th>
                <th className="py-4">Status</th>
                <th className="py-4 text-right pr-4">Action</th>
                </tr>
            </thead>
            <tbody>
                {salesData.map((row) => (
                <tr key={row.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 pl-4"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 accent-[#8A63D2]" /></td>
                    <td className="py-5 pl-2 font-bold text-gray-900 text-sm">{row.product}</td>
                    <td className="py-5 text-sm text-gray-500 font-medium">{row.category}</td>
                    {/* Platform column removed */}
                    <td className="py-5 text-sm text-gray-900 font-bold">{row.orders}</td>
                    <td className="py-5 text-sm text-gray-900 font-bold">{row.price}</td>
                    <td className="py-5 text-sm font-bold text-gray-900">{row.amount}</td>
                    <td className="py-5">
                    <StatusBadge status={row.status} />
                    </td>
                    <td className="py-5 text-right pr-4">
                    <button className="rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-100 transition-colors">
                        Manage
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
