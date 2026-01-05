'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Reuse the getWebsiteId from productActions
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

  if (authError || !user) return null;

  const { data: website } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!website) {
       // fallback maybeSingle
     const { data: firstWebsite } = await supabaseAdmin
        .from('websites')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
     return firstWebsite?.id || null;
  }
  return website.id;
}

// --- Sync Helper ---
async function syncWebsiteData(websiteId) {
    try {
        const { data: products } = await supabaseAdmin
          .from('products')
          .select('*')
          .eq('website_id', websiteId)
          .order('id');

        const { data: categories } = await supabaseAdmin
          .from('categories')
          .select('id, name')
          .eq('website_id', websiteId);

        if (!products) return;

        const { data: website } = await supabaseAdmin
          .from('websites')
          .select('website_data')
          .eq('id', websiteId)
          .single();

        if (!website) return;

        const currentData = website.website_data || {};

        const mappedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category_id ? String(p.category_id) : 'uncategorized',
            description: p.description,
            image: p.image_url,
            stock: p.stock
        }));

        const mappedCategories = categories ? categories.map(c => ({
            id: String(c.id),
            name: c.name
        })) : [];

        const newData = {
            ...currentData,
            allProducts: mappedProducts,
            categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || [])
        };

        await supabaseAdmin
          .from('websites')
          .update({ website_data: newData })
          .eq('id', websiteId);

      } catch (err) {
        console.error("Error syncing website data:", err);
      }
}

export async function createQuickInvoiceOrder(orderData) {
  try {
    const websiteId = await getWebsiteId();
    if (!websiteId) throw new Error("Unauthorized");

    // 1. Create/Find Customer
    let customerId = null;

    // Always create new customer record for POS to track separate instances unless logic changes
    const { data: newCustomer, error: custError } = await supabaseAdmin
        .from('customers')
        .insert({
            website_id: websiteId,
            name: orderData.customerName,
            email: orderData.customerEmail || null,
            shipping_address: orderData.customerAddress ? { address: orderData.customerAddress } : {}
        })
        .select()
        .single();

    if (custError) throw custError;
    customerId = newCustomer.id;

    // 2. Create Order
    const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
            website_id: websiteId,
            customer_id: customerId,
            total_amount: orderData.totalAmount,
            status: 'paid', // POS orders are paid
            source: 'pos'
        })
        .select()
        .single();

    if (orderError) throw orderError;

    // 3. Create Order Items & Update Stock
    for (const item of orderData.items) {
        await supabaseAdmin.from('order_items').insert({
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity,
            price: item.price
        });

        // Update Stock
        if (item.stock !== -1) {
             const { error: stockError } = await supabaseAdmin.rpc('decrement_stock', {
                 p_id: item.productId,
                 qty: item.quantity
             });
             // Fallback
             if (stockError) {
                 const { data: prod } = await supabaseAdmin.from('products').select('stock').eq('id', item.productId).single();
                 if (prod && prod.stock !== -1) {
                     await supabaseAdmin.from('products').update({ stock: prod.stock - item.quantity }).eq('id', item.productId);
                 }
             }
        }
    }

    // 4. Sync
    await syncWebsiteData(websiteId);

    return { success: true, orderId: order.id, orderNumber: order.id };

  } catch (err) {
    console.error("Quick Invoice Error:", err);
    return { success: false, error: err.message };
  }
}

export async function searchProducts(queryStr) {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) return [];

        let query = supabaseAdmin
            .from('products')
            .select('id, name, price, stock, image_url, category_id')
            .eq('website_id', websiteId)
            .limit(100); // Increased limit

        if (queryStr) {
            query = query.ilike('name', `%${queryStr}%`);
        }

        const { data, error } = await query;
        if (error) {
            console.error("searchProducts Error:", error);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error("searchProducts Exception:", e);
        return [];
    }
}

export async function getCategories() {
    try {
        const websiteId = await getWebsiteId();
        if (!websiteId) return [];

        const { data, error } = await supabaseAdmin
            .from('categories')
            .select('id, name')
            .eq('website_id', websiteId);

        if (error) return [];
        return data || [];
    } catch (e) {
        return [];
    }
}

export async function getShopDetails() {
    const websiteId = await getWebsiteId();
    if (!websiteId) return null;

    const { data } = await supabaseAdmin.from('websites').select('website_data, site_slug').eq('id', websiteId).single();
    return data;
}
