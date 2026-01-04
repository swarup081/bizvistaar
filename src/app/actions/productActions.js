'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
             // The `setAll` method was called from a Server Component.
             // This can be ignored if you have middleware refreshing
             // user sessions.
           }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error or no user:", authError);
    return null;
  }

  // Fetch website ID for this user
  const { data: website, error: websiteError } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (websiteError || !website) {
    console.error("No website found for user:", websiteError);
    return null;
  }

  return website.id;
}

export async function getCategories() {
  const websiteId = await getWebsiteId();
  if (!websiteId) return [];

  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, name')
    .eq('website_id', websiteId)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export async function addProduct(productData) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error("No website ID found to associate product with.");

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        category_id: productData.categoryId,
        description: productData.description,
        image_url: productData.imageUrl,
        website_id: websiteId
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, product: data };
  } catch (err) {
    console.error('Error adding product:', err);
    return { success: false, error: err.message };
  }
}

export async function getProducts({ page = 1, limit = 10, search = '', categoryId = null, stockStatus = [] }) {
  try {
    const websiteId = await getWebsiteId();
    // If no website found (e.g. not logged in), return empty to be safe
    if (!websiteId) {
        return { products: [], totalCount: 0 };
    }

    // Since we need to filter by 'mocked' stock status, we must fetch all products matching the DB filters first,
    // then filter by stock in memory, then paginate.
    // This is inefficient for large datasets but necessary given the schema constraints (missing stock column).

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories ( name )
      `)
      .eq('website_id', websiteId);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    // Fetch all matching DB records
    const { data: products, error } = await query;

    if (error) throw error;

    // Process products (Mock Stock + Analytics)
    const processedProducts = await Promise.all(products.map(async (p) => {
      // 1. Mock Stock (Deterministic based on ID)
      const hash = String(p.id).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
      const stockCount = Math.abs(hash % 150); // 0 to 149

      let status = 'Active';
      if (stockCount === 0) status = 'Out Of Stock';
      else if (stockCount < 20) status = 'Low Stock';
      else if (stockCount > 100) status = 'Overflow Stock';

      // 2. Analytics (Fetch order counts for last 7 days)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);

      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('quantity, orders!inner(created_at)')
        .eq('product_id', p.id)
        .gte('orders.created_at', startDate.toISOString());

      const dailySales = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailySales[key] = 0;
      }

      if (orderItems) {
        orderItems.forEach(item => {
           const dateStr = new Date(item.orders.created_at).toISOString().split('T')[0];
           if (dailySales[dateStr] !== undefined) {
             dailySales[dateStr] += item.quantity || 1;
           }
        });
      }

      const analyticsData = Object.keys(dailySales).sort().map(date => ({
        date,
        value: dailySales[date]
      }));

      // Inject mock noise if empty for demo
      const totalSales = analyticsData.reduce((acc, curr) => acc + curr.value, 0);
      if (totalSales === 0 && stockCount > 0) {
          analyticsData.forEach((d, i) => {
              d.value = Math.floor(Math.abs(Math.sin(hash + i) * 10));
          });
      }

      return {
        ...p,
        stock: stockCount,
        stockStatus: status,
        categoryName: p.categories?.name || 'Uncategorized',
        analytics: analyticsData
      };
    }));

    // Filter by Stock Status in Memory
    let finalProducts = processedProducts;
    if (stockStatus && stockStatus.length > 0) {
      finalProducts = finalProducts.filter(p => stockStatus.includes(p.stockStatus));
    }

    // Paginate in Memory
    const totalCount = finalProducts.length;
    const from = (page - 1) * limit;
    const to = from + limit;
    const paginatedProducts = finalProducts.slice(from, to);

    return {
      products: paginatedProducts,
      totalCount: totalCount
    };

  } catch (err) {
    console.error('Error fetching products:', err);
    return { products: [], totalCount: 0, error: err.message };
  }
}
