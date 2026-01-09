'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import RevenueChart from './RevenueChart';
import StateSalesChart from './StateSalesChart';
import TopProductsTable from './TopProductsTable';
import { Loader2, DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

function OverviewCards({ metrics, topProduct }) {
    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${metrics.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
        },
        {
            title: 'Total Orders',
            value: metrics.totalOrders,
            icon: ShoppingBag,
        },
        {
            title: 'Total Visitors',
            value: metrics.totalVisitors,
            icon: Users,
        },
        {
            title: 'Top Product',
            value: topProduct ? `₹${topProduct.revenue.toLocaleString()}` : '—',
            subValue: topProduct ? topProduct.name : 'No sales yet',
            icon: TrendingUp,
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                             {card.subValue && (
                                <p className="text-xs text-gray-500 truncate max-w-[150px]" title={card.subValue}>{card.subValue}</p>
                            )}
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <card.icon className="w-5 h-5 text-black" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function AnalyticsOverview() {
    const [timeRange, setTimeRange] = useState('week'); // week, month, year
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [websiteId, setWebsiteId] = useState(null);

    // 1. Fetch Website ID
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            const { data: website } = await supabase
                .from('websites')
                .select('id')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            if (website) {
                setWebsiteId(website.id);
            } else {
                setError("No website found.");
                setLoading(false);
            }
        };
        init();
    }, []);

    // 2. Fetch Analytics Data
    const fetchData = useCallback(async () => {
        if (!websiteId) return;
        setLoading(true);
        setError(null);

        try {
            // Determine Date Range
            const now = new Date();
            let startDate = new Date();
            if (timeRange === 'week') startDate.setDate(now.getDate() - 7);
            else if (timeRange === 'month') startDate.setMonth(now.getMonth() - 1);
            else if (timeRange === 'year') startDate.setFullYear(now.getFullYear() - 1);

            const startIso = startDate.toISOString();

            // Fetch Orders
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select(`
                    id, created_at, total_amount, status,
                    customers ( shipping_address ),
                    order_items ( quantity, price, product_id, products ( name, stock ) )
                `)
                .eq('website_id', websiteId)
                .gte('created_at', startIso)
                .neq('status', 'canceled')
                .order('created_at', { ascending: true });

            if (ordersError) throw new Error("Orders: " + ordersError.message);

            // Fetch Visitors
            const { data: visitors, error: visitorsError } = await supabase
                .from('client_analytics')
                .select('timestamp')
                .eq('website_id', websiteId)
                .gte('timestamp', startIso);

            if (visitorsError) throw new Error("Analytics: " + visitorsError.message);

            // --- Aggregation ---

            // Metrics
            const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
            const totalOrders = orders.length;
            const totalVisitors = visitors.length;

            // Chart Data
            const chartDataMap = new Map();
            let currentDate = new Date(startDate);
            const endDate = new Date();
            while (currentDate <= endDate) {
                const dateKey = currentDate.toISOString().split('T')[0];
                chartDataMap.set(dateKey, { name: dateKey, visitors: 0, revenue: 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            visitors.forEach(v => {
                const dateKey = new Date(v.timestamp).toISOString().split('T')[0];
                if (chartDataMap.has(dateKey)) chartDataMap.get(dateKey).visitors += 1;
            });

            orders.forEach(o => {
                const dateKey = new Date(o.created_at).toISOString().split('T')[0];
                if (chartDataMap.has(dateKey)) chartDataMap.get(dateKey).revenue += (Number(o.total_amount) || 0);
            });

            let chartData = Array.from(chartDataMap.values()).sort((a, b) => new Date(a.name) - new Date(b.name));

            // Formatting
            chartData = chartData.map(d => {
                const date = new Date(d.name);
                return {
                    ...d,
                    name: timeRange === 'year'
                        ? date.toLocaleDateString('en-US', { month: 'short' })
                        : date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
                };
            });

            if (timeRange === 'year') {
                const monthlyMap = new Map();
                chartData.forEach(d => {
                    // Re-parse or just use the name if it's already "Jan" (Wait, format above makes it "Jan" for year)
                    // But duplicates? "Jan" appears multiple times if we map daily to Jan?
                    // Ah, the loop above generates DAILY points.
                    // If I map "Jan 01" to "Jan", then multiple points have name "Jan".
                    // I should aggregate.
                    const key = d.name; // "Jan"
                    if (!monthlyMap.has(key)) monthlyMap.set(key, { name: key, visitors: 0, revenue: 0, sortIdx: 0 });
                    const entry = monthlyMap.get(key);
                    entry.visitors += d.visitors;
                    entry.revenue += d.revenue;
                });
                 // To sort months correctly we need a better key, but for now rely on insertion order or date?
                 // The source `chartData` is sorted by date. So "Jan" comes first, then "Feb".
                 // Map iteration preserves insertion order.
                 chartData = Array.from(monthlyMap.values());
            }

            // Sales By State
            const stateMap = {};
            orders.forEach(o => {
                const addr = o.customers?.shipping_address || {};
                const rawState = addr.state || 'Unknown';
                const state = rawState.trim();
                if (!stateMap[state]) stateMap[state] = 0;
                stateMap[state] += (Number(o.total_amount) || 0);
            });
            const salesByState = Object.entries(stateMap)
                .map(([state, sales]) => ({ state, sales }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 10);

            // Top Products
            const productMap = new Map();
            orders.forEach(o => {
                if (o.order_items) {
                    o.order_items.forEach(item => {
                        const pid = item.product_id;
                        if (!productMap.has(pid)) {
                            productMap.set(pid, {
                                id: pid,
                                name: item.products?.name || 'Unknown',
                                price: item.price,
                                sales: 0,
                                revenue: 0,
                                stock: item.products?.stock
                            });
                        }
                        const entry = productMap.get(pid);
                        entry.sales += item.quantity;
                        entry.revenue += (item.quantity * item.price);
                    });
                }
            });
            const topProducts = Array.from(productMap.values())
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map(p => ({
                    ...p,
                    status: p.stock === -1 ? 'Unlimited' : (p.stock > 0 ? 'In Stock' : 'Out of Stock')
                }));

            setData({
                metrics: { totalRevenue, totalOrders, totalVisitors },
                chartData,
                salesByState,
                topProducts
            });

        } catch (err) {
            console.error("Analytics Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [websiteId, timeRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (loading || !data) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
    );

    return (
        <div className="space-y-6">
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

            <OverviewCards metrics={data.metrics} topProduct={data.topProducts[0]} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trend</h3>
                    <RevenueChart data={data.chartData} />
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by State</h3>
                    <StateSalesChart data={data.salesByState} />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
                </div>
                <TopProductsTable products={data.topProducts} />
            </div>
        </div>
    );
}
