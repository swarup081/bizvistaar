"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  ArrowUp,
  ArrowDown,
  Globe
} from "lucide-react";
import AnalyticsOverview from "@/components/dashboard/analytics/AnalyticsOverview";
import RevenueChart from "@/components/dashboard/analytics/RevenueChart";
import VisitorsChart from "@/components/dashboard/analytics/VisitorsChart";
import TopProducts from "@/components/dashboard/analytics/TopProducts";
import TopPages from "@/components/dashboard/analytics/TopPages";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalVisitors: 0,
    conversionRate: 0,
    revenueData: [],
    visitorsData: [],
    topProducts: [],
    topPages: [],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // 1. Get User & Website
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: website } = await supabase
        .from("websites")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!website) {
        setLoading(false);
        return;
      }

      // 2. Calculate Date Range
      const now = new Date();
      let startDate = new Date();
      if (dateRange === "7d") startDate.setDate(now.getDate() - 7);
      if (dateRange === "30d") startDate.setDate(now.getDate() - 30);
      if (dateRange === "90d") startDate.setDate(now.getDate() - 90);

      const startDateISO = startDate.toISOString();

      // 3. Parallel Fetching
      const [ordersRes, eventsRes] = await Promise.all([
        supabase
          .from("orders")
          .select("id, total_amount, created_at, status")
          .eq("website_id", website.id)
          .gte("created_at", startDateISO)
          .neq("status", "canceled"),

        supabase
          .from("client_analytics")
          .select("id, event_type, timestamp, location, path")
          .eq("website_id", website.id)
          .gte("timestamp", startDateISO)
      ]);

      const orders = ordersRes.data || [];
      const events = eventsRes.data || [];

      // 4. Fetch Order Items (for Top Products)
      let orderItems = [];
      const orderIds = orders.map(o => o.id);
      if (orderIds.length > 0) {
        const { data: items } = await supabase
          .from("order_items")
          .select("quantity, price, products(name)")
          .in("order_id", orderIds);
        orderItems = items || [];
      }

      // --- CALCULATIONS ---

      // A. Totals
      const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
      const totalOrders = orders.length;

      // B. Unique Visitors
      const uniqueVisitors = new Set();
      events.forEach(e => {
        if (e.location && e.location.visitor_id) {
          uniqueVisitors.add(e.location.visitor_id);
        } else {
           // If no visitor_id, use IP if available, or just fallback.
           // Since we can't reliably dedup without ID, we might undercount or overcount.
           // We'll count distinct IPs if available.
           if (e.location && e.location.ip) uniqueVisitors.add(e.location.ip);
        }
      });
      // Fallback: if 0 unique visitors but we have events, assume at least some visitors.
      // E.g. 1 visitor per 5 pageviews? Or just use pageviews.
      // Let's stick to unique set size. If 0 and events > 0, maybe the tracker failed to send ID.
      const totalVisitors = uniqueVisitors.size || (events.length > 0 ? Math.ceil(events.length / 3) : 0);

      // C. Conversion
      const conversionRate = totalVisitors > 0 ? ((totalOrders / totalVisitors) * 100).toFixed(1) : "0.0";

      // D. Charts
      // Helper to group by date
      const groupByDate = (items, dateKey, valueKey = null, count = false) => {
        const map = {};
        // Initialize all dates in range to 0
        const d = new Date(startDate);
        while (d <= now) {
            const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            map[key] = 0;
            d.setDate(d.getDate() + 1);
        }

        items.forEach(item => {
            const itemDate = new Date(item[dateKey]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (map[itemDate] !== undefined) {
                if (count) map[itemDate] += 1;
                else map[itemDate] += (Number(item[valueKey]) || 0);
            }
        });
        return Object.keys(map).map(date => ({ date, value: map[date] }));
      };

      const revenueData = groupByDate(orders, 'created_at', 'total_amount');
      const visitorsData = groupByDate(events, 'timestamp', null, true); // This counts Page Views actually.
      // If we want Unique Visitors per day, it's more complex. For now "Traffic" = Page Views is standard for simple dashboards.

      // E. Top Products
      const productMap = {};
      orderItems.forEach(item => {
        const name = item.products?.name || "Unknown Product";
        productMap[name] = (productMap[name] || 0) + item.quantity;
      });
      const topProducts = Object.entries(productMap)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      // F. Top Pages
      const pageMap = {};
      events.forEach(e => {
         const path = e.path || '/';
         pageMap[path] = (pageMap[path] || 0) + 1;
      });
      const topPages = Object.entries(pageMap)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      setData({
        totalRevenue,
        totalOrders,
        totalVisitors,
        conversionRate,
        revenueData,
        visitorsData,
        topProducts,
        topPages
      });

    } catch (err) {
      console.error("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 font-sans text-[#333] pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Monitor your store's performance and visitor stats.</p>
        </div>

        {/* Date Filter */}
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 self-start md:self-auto">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                dateRange === r
                  ? 'bg-[#8A63D2] text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              Last {r.replace('d', ' Days')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400">Loading analytics...</div>
      ) : (
        <>
           <AnalyticsOverview
             revenue={data.totalRevenue}
             orders={data.totalOrders}
             visitors={data.totalVisitors}
             conversion={data.conversionRate}
           />

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RevenueChart data={data.revenueData} />
              <VisitorsChart data={data.visitorsData} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopProducts products={data.topProducts} />
              <TopPages pages={data.topPages} />
           </div>
        </>
      )}
    </div>
  );
}
