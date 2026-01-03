"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sales: 4000, units: 2400 },
  { name: "Feb", sales: 6000, units: 2200 },
  { name: "Mar", sales: 5000, units: 2800 },
  { name: "Apr", sales: 2780, units: 6200 },
  { name: "May", sales: 7836, units: 85 }, // Specific data point mentioned
  { name: "Jun", sales: 2390, units: 6000 },
  { name: "Jul", sales: 3490, units: 7000 },
  { name: "Aug", sales: 6000, units: 4000 },
  { name: "Sep", sales: 8000, units: 2800 },
  { name: "Oct", sales: 5000, units: 10000 },
  { name: "Nov", sales: 6800, units: 6500 },
  { name: "Dec", sales: 6200, units: 7800 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-xl">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-sm font-semibold text-[#8A63D2]">
          Sales: ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm font-semibold text-[#A0C4FF]">
          Units: {payload[1].value}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex list-none gap-6 justify-end mb-4">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-sm font-medium text-gray-600">
          <span
             className="block h-3 w-3 rounded-sm"
             style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export default function SalesSummaryChart() {
  return (
    <div className="col-span-1 md:col-span-3 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-900">
               {/* Bar Chart Icon simulation */}
               <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 20V10" />
                   <path d="M18 20V4" />
                   <path d="M6 20v-4" />
               </svg>
           </div>
           <div>
               <h3 className="text-lg font-bold text-gray-900">Sales Summary</h3>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            <div>
               <p className="text-3xl font-extrabold text-gray-900">$3,400,000.00</p>
               <p className="text-sm font-medium text-[#4CAF50]">Average Monthly $7,000.00</p>
            </div>
            {/* Legend will be rendered by Recharts, but we can also place it here if we want absolute control.
                Recharts CustomLegend is safer for data syncing. */}
        </div>
      </div>

      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: -20,
              bottom: 0,
            }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                dy={10}
            />
            <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value/1000}K`}
            />
            <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
            <Legend content={<CustomLegend />} verticalAlign="top" align="right" />
            <Bar
                yAxisId="left"
                dataKey="sales"
                name="Sales"
                fill="#8A63D2"
                radius={[4, 4, 0, 0]}
                barSize={12}
            />
            <Bar
                yAxisId="right"
                dataKey="units"
                name="Units"
                fill="#A0C4FF"
                radius={[4, 4, 0, 0]}
                barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
