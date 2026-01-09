'use client';

import { useState, useEffect } from 'react';
import { getDashboardData } from '@/app/actions/analyticsActions';
import OverviewCards from './OverviewCards';
import RevenueWaveChart from './RevenueWaveChart';
import StateSalesChart from './StateSalesChart';
import TopProductsTable from './TopProductsTable';
import { Loader2 } from 'lucide-react';

export default function AnalyticsDashboard() {
    const [timeRange, setTimeRange] = useState('week'); // week, month, year
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);
            try {
                const result = await getDashboardData(timeRange);
                if (isMounted) {
                    if (result.error) {
                        setError(result.error);
                    } else {
                        setData(result);
                        setError(null);
                    }
                }
            } catch (err) {
                if (isMounted) setError(err.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchData();
        return () => { isMounted = false; };
    }, [timeRange]);

    if (error) {
        return <div className="p-8 text-center text-red-500">Error loading analytics: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500">Track your store's performance</p>
                </div>

                <div className="bg-white rounded-lg p-1 border border-gray-200 flex text-sm font-medium">
                    {['week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-md transition-colors ${
                                timeRange === range
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            ) : (
                <>
                    {/* Overview Cards */}
                    <OverviewCards metrics={data.metrics} topProduct={data.topProducts[0]} />

                    {/* Main Chart Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trend</h3>
                            <RevenueWaveChart data={data.chartData} />
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by State</h3>
                            <StateSalesChart data={data.salesByState} />
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
                        </div>
                        <TopProductsTable products={data.topProducts} />
                    </div>
                </>
            )}
        </div>
    );
}
