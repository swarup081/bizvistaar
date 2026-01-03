"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChevronDown, DollarSign } from "lucide-react";

// Data for the donut chart
const data = [
  { name: "Growth", value: 10 },
  { name: "Remaining", value: 90 },
];

const COLORS = ["#8A63D2", "#F3F4F6"]; // Purple and Light Gray

export default function UserGrowthChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 font-sans">User Growth</h3>
        <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
           This Year
           <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={100}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-extrabold text-gray-900">3,740</span>
                <span className="text-sm font-bold text-[#4CAF50] mt-1">↑ 10%</span>
            </div>
        </div>
      </div>

      {/* Bottom Right Stat */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3">
         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <DollarSign className="h-5 w-5" />
         </div>
         <div>
             <p className="text-xs text-gray-500 font-medium">Total Customers</p>
             <p className="text-lg font-bold text-gray-900">7,429</p>
         </div>
      </div>
    </div>
  );
}
