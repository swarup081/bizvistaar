'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Service role client for privileged database access (bypassing RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HELPER: Get Current Website ID ---
async function getWebsiteId() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
           try {
             cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
           } catch {
             // Pass
           }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // Fetch website ID for this user
  const { data: website, error: websiteError } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (websiteError) {
     // Fallback: Try to find *any* website for this user if .single() failed due to multiple rows (though logic prevents this usually)
     const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();

     if (firstWebsite) return firstWebsite.id;
     return null;
  }

  return website?.id;
}

export async function getDashboardData(timeRange = 'week') {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) {
      return { error: 'Website not found' };
    }

    // Determine Date Range
    const now = new Date();
    let startDate = new Date();

    if (timeRange === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'year') {
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const startIso = startDate.toISOString();

    // 1. Fetch Orders (with customers and items)
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select(`
        id, created_at, total_amount, status, source,
        customers ( shipping_address ),
        order_items ( quantity, price, product_id, products ( name, price, stock ) )
      `)
      .eq('website_id', websiteId)
      .gte('created_at', startIso)
      .neq('status', 'canceled') // Exclude canceled orders
      .order('created_at', { ascending: true });

    if (ordersError) throw ordersError;

    // 2. Fetch Visitors (Client Analytics)
    const { data: visitors, error: visitorsError } = await supabaseAdmin
      .from('client_analytics')
      .select('created_at:timestamp') // Alias timestamp to created_at for consistency if needed, but schema says 'timestamp'
      .eq('website_id', websiteId)
      .gte('timestamp', startIso);

    if (visitorsError) throw visitorsError;

    // --- AGGREGATION ---

    // Metrics
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const totalOrders = orders.length;
    const totalVisitors = visitors.length;

    // Wave Chart Data (Group by Day)
    const chartDataMap = new Map();

    // Initialize map with empty dates to ensure continuous line
    let currentDate = new Date(startDate);
    const endDate = new Date();
    while (currentDate <= endDate) {
        const dateKey = currentDate.toISOString().split('T')[0];
        chartDataMap.set(dateKey, { name: dateKey, visitors: 0, revenue: 0 });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill Visitor Data
    visitors.forEach(v => {
        const dateKey = new Date(v.timestamp || v.created_at).toISOString().split('T')[0];
        if (chartDataMap.has(dateKey)) {
            const entry = chartDataMap.get(dateKey);
            entry.visitors += 1;
        }
    });

    // Fill Revenue Data
    orders.forEach(o => {
        const dateKey = new Date(o.created_at).toISOString().split('T')[0];
        if (chartDataMap.has(dateKey)) {
            const entry = chartDataMap.get(dateKey);
            entry.revenue += Number(o.total_amount) || 0;
        }
    });

    // Convert Map to Array & Sort
    const chartData = Array.from(chartDataMap.values()).sort((a, b) => new Date(a.name) - new Date(b.name));

    // Format Dates for display (e.g., "Mon", "Feb 20")
    const formattedChartData = chartData.map(d => {
        const date = new Date(d.name);
        return {
            ...d,
            name: timeRange === 'year'
                ? date.toLocaleDateString('en-US', { month: 'short' })
                : date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
        };
    });
    // For year view, we might want to aggregate by month instead of day to avoid too many points?
    // User requested "Wave Graph", detailed is okay. But for Year, 365 points is too many.
    // Let's optimize: If Year, aggregate by Month.

    let finalChartData = formattedChartData;
    if (timeRange === 'year') {
         const monthlyMap = new Map();
         chartData.forEach(d => {
             const date = new Date(d.name); // d.name is 'YYYY-MM-DD'
             const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // "Jan 2024"

             if (!monthlyMap.has(monthKey)) {
                 monthlyMap.set(monthKey, { name: monthKey, visitors: 0, revenue: 0, sortDate: date });
             }
             const entry = monthlyMap.get(monthKey);
             entry.visitors += d.visitors;
             entry.revenue += d.revenue;
         });
         finalChartData = Array.from(monthlyMap.values())
            .sort((a, b) => a.sortDate - b.sortDate)
            .map(({ sortDate, ...rest }) => rest);
    }


    // Sales by State
    const stateMap = {};
    orders.forEach(o => {
        // shipping_address is JSONB
        const addr = o.customers?.shipping_address || {};
        // Normalize state name (trim, lowercase?)
        const rawState = addr.state || 'Unknown';
        const state = rawState.trim();

        if (!stateMap[state]) stateMap[state] = 0;
        stateMap[state] += Number(o.total_amount) || 0;
    });

    const salesByState = Object.entries(stateMap)
        .map(([state, amount]) => ({ state, sales: amount }))
        .sort((a, b) => b.sales - a.sales) // Descending
        .slice(0, 10); // Top 10

    // Top Products
    const productMap = new Map();
    orders.forEach(o => {
        if (o.order_items && Array.isArray(o.order_items)) {
            o.order_items.forEach(item => {
                const pid = item.product_id;
                if (!productMap.has(pid)) {
                    productMap.set(pid, {
                        id: pid,
                        name: item.products?.name || 'Unknown Product',
                        price: item.price, // Unit price at time of sale
                        sales: 0,
                        revenue: 0,
                        stock: item.products?.stock // Current stock
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


    return {
        metrics: {
            totalRevenue,
            totalOrders,
            totalVisitors,
        },
        chartData: finalChartData,
        salesByState,
        topProducts
    };

  } catch (err) {
    console.error("Dashboard Analytics Error:", err);
    return { error: err.message };
  }
}
