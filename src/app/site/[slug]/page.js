// src/app/site/[slug]/page.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function LiveSitePage({ params }) {
  
  // --- NEW DEBUG LOGS ---
  console.log("--- New Site Request ---");
  console.log("Received Params Object:", JSON.stringify(params)); 
  // This is the most important log. It should show: {"slug": "ajshdbqwhed178236-1763143942312"}
  // --- END OF NEW DEBUG LOGS ---

  const { slug } = params;

  if (!slug || slug === 'undefined') {
    console.warn(`Slug is '${slug}', showing 404.`); // This will tell us *why* it's failing
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Not Found</h1>
        <p>This page does not exist.</p>
      </div>
    );
  }
  
  // If you see this log, the slug is working!
  console.log(`Attempting to fetch site with slug: ${slug}`);

  // 1. Fetch the website data from Supabase using the slug
  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`
      is_published,
      website_data,
      template:templates ( name )
    `)
    .eq('site_slug', slug)
    .single();

  // 2. Handle errors
  if (error) {
    console.error("Supabase query error:", error.message);
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>500 - Server Error</h1>
        <p>Could not query database. Check Vercel logs.</p>
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      </div>
    );
  }

  // 3. Handle "Site Not Found" (after a successful query)
  if (!site) {
    console.warn("Query successful, but no site found.");
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Site Not Found</h1>
        <p>Query ran, but no site matches this slug:</p>
        <p><strong>{slug}</strong></p>
      </div>
    );
  }

  // 4. Handle "Not Published"
  if (!site.is_published) {
    console.warn("Site found, but it is not published.");
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Site Not Published</h1>
        <p>This site has been created but has not been published yet.</p>
      </div>
    );
  }

  // SUCCESS!
  console.log("Success! Site found and is published.");
  const templateName = site.template.name;
  const websiteData = site.website_data;

  return (
    <div style={{ padding: '40px' }}>
      <h1>Success! Your Live Site Data is Here:</h1>
      <p><strong>Site Slug:</strong> {slug}</p>
      <p><strong>Template to use:</strong> {templateName}</p>
      <hr style={{ margin: '20px 0' }} />
      <h2>Website JSON Data:</h2>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
        {JSON.stringify(websiteData, null, 2)}
      </pre>
    </div>
  );
}