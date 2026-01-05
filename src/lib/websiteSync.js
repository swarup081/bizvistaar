import { supabase } from '@/lib/supabaseClient';

export async function syncWebsiteDataClient(websiteId) {
    if (!websiteId) return;

    try {
        // 1. Fetch all products and categories for this website
        const { data: products, error: prodError } = await supabase
            .from('products')
            .select('*')
            .eq('website_id', websiteId)
            .order('id', { ascending: false }); // Latest first

        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, name')
            .eq('website_id', websiteId);

        if (prodError || catError) {
            console.error("Sync fetch error:", prodError || catError);
            return;
        }

        // 2. Fetch current website data to preserve other fields
        const { data: website, error: siteError } = await supabase
            .from('websites')
            .select('website_data')
            .eq('id', websiteId)
            .limit(1)
            .maybeSingle();

        if (siteError || !website) {
             console.error("Sync website fetch error:", siteError);
             return;
        }

        const currentData = website.website_data || {};

        // 3. Map Data
        const mappedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            category: p.category_id ? String(p.category_id) : 'uncategorized',
            description: p.description,
            image: p.image_url,
            stock: p.stock // -1 is Unlimited
        }));

        const mappedCategories = categories ? categories.map(c => ({
            id: String(c.id),
            name: c.name
        })) : [];

        // 4. Update website_data JSON
        const newData = {
            ...currentData,
            allProducts: mappedProducts,
            // Only update categories if we have some, otherwise keep existing or empty
            categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || [])
        };

        const { error: updateError } = await supabase
            .from('websites')
            .update({ website_data: newData })
            .eq('id', websiteId);

        if (updateError) {
            console.error("Sync update error:", updateError);
        } else {
            console.log("Website JSON synced successfully (Client-Side).");
        }

    } catch (err) {
        console.error("Sync unexpected error:", err);
    }
}
