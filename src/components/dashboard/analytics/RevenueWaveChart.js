'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Defs, LinearGradient } from 'recharts';

export default function RevenueWaveChart({ data }) {
    const [activeTab, setActiveTab] = useState('revenue'); // 'revenue' or 'visitors'

    const formatYAxis = (value) => {
        if (activeTab === 'revenue') return `₹${value}`;
        return value;
    };

    const color = activeTab === 'revenue' ? '#8A63D2' : '#2563EB'; // Purple or Blue

    return (
        <div className="h-[350px] flex flex-col">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTab('revenue')}
                    className={`text-sm px-3 py-1 rounded-full border transition-all ${
                        activeTab === 'revenue'
                        ? 'bg-purple-100 text-purple-700 border-purple-200 font-medium'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Revenue
                </button>
                <button
                    onClick={() => setActiveTab('visitors')}
                    className={`text-sm px-3 py-1 rounded-full border transition-all ${
                        activeTab === 'visitors'
                        ? 'bg-blue-100 text-blue-700 border-blue-200 font-medium'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    Visitors
                </button>
            </div>

            <div className="flex-grow w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={formatYAxis}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [
                                activeTab === 'revenue' ? `₹${value.toLocaleString()}` : value,
                                activeTab === 'revenue' ? 'Revenue' : 'Visitors'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey={activeTab}
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWave)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
