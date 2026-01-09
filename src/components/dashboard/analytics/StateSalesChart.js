'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StateSalesChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex flex-col items-center justify-center text-gray-400">
                <p>No sales location data yet.</p>
            </div>
        );
    }

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="state"
                        type="category"
                        width={80}
                        tick={{ fontSize: 12, fill: '#4B5563' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Sales']}
                        contentStyle={{ borderRadius: '8px' }}
                    />
                    <Bar dataKey="sales" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="#8A63D2" />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
