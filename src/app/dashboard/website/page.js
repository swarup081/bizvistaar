'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import EditorLayout from '@/components/editor/EditorLayout';
import Link from 'next/link';

export default function WebsiteDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserWebsite() {
      try {
        // 1. Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // If no user, maybe redirect to login? But for now just show error.
            setError("Please log in to view your website.");
            setLoading(false);
            return;
        }

        // 2. Fetch website for this user
        const { data: site, error: dbError } = await supabase
          .from('websites')
          .select('id, site_slug, template, website_data')
          .eq('user_id', user.id)
          .maybeSingle();

        if (dbError) {
             console.error('Error fetching website:', JSON.stringify(dbError, null, 2));
             setError("Failed to load website.");
        } else if (site) {
             let templateName = 'flara'; // Default

             // If 'template' is just an ID (or we didn't join), we might need to fetch the name.
             // However, checking the previous code, it assumed 'template' was an object.
             // If we select just 'template', it might be the FK ID.
             // Let's assume it IS the FK ID now because we removed the join.

             if (site.template) {
                 // Check if it's already an object (if Supabase returned it expanded despite no join syntax, unlikely)
                 // or if it's an ID.
                 if (typeof site.template === 'object' && site.template.name) {
                     templateName = site.template.name;
                 } else {
                     // Fetch template name
                     const { data: templateData, error: templateError } = await supabase
                        .from('templates')
                        .select('name')
                        .eq('id', site.template)
                        .maybeSingle();

                     if (templateData) {
                         templateName = templateData.name;
                     }
                 }
             }

             setWebsite({
                 id: site.id,
                 slug: site.site_slug,
                 templateName: templateName,
                 data: site.website_data
             });
        } else {
            setError("You haven't created a website yet.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserWebsite();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
            <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
            <Link href="/templates" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                Create a Website
            </Link>
        </div>
    );
  }

  return (
    <EditorLayout
        mode="dashboard"
        templateName={website.templateName}
        websiteId={website.id}
    />
  );
}
