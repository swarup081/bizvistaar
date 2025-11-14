// src/app/site/[slug]/page.js
import { createClient } from '@supabase/supabase-js';

// IMPORTANT: This page runs on the VERCEL SERVER, not the browser.
// We MUST use the SERVICE_ROLE_KEY to securely fetch any
// website's data, bypassing Row Level Security.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // You must add this to Vercel
);

// This is the "Live Site" page
export default async function LiveSitePage({ params }) {
  const { slug } = params;

  // 1. Fetch the website data from Supabase using the slug
  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select(`
      is_published,
      website_data,
      template:templates ( name )
    `)
    .eq('site_slug', slug) // Find the site by its slug
    .single(); // We only expect one

  // 2. Handle errors
  if (error || !site) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>404 - Site Not Found</h1>
        <p>We could not find a site with this URL.</p>
      </div>
    );
  }

  // 3. Handle "Not Published"
  if (!site.is_published) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Site Not Published</h1>
        <p>This site has been created but has not been published yet.</p>
      </div>
    );
  }

  // 4. SUCCESS! Display the raw data
  // This proves the entire flow is working.
  // The next step would be to render the actual template
  // component here, passing this data in.
  
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