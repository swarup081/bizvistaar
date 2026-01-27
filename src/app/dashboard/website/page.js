'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import EditorLayout from '@/components/editor/EditorLayout';
import Link from 'next/link';

// --- Draft List Component ---
const DraftList = ({ drafts, liveSite, onSelect }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Websites</h1>
            <p className="text-gray-500 mt-1">Manage your live site and drafts.</p>
          </div>
          <Link href="/templates" className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition">
             + New Website
          </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Live Site Card */}
        {liveSite && (
             <div
                onClick={() => onSelect('site', liveSite.id)}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Live</span>
                        <span className="text-xs text-gray-400">Last edited {new Date(liveSite.updated_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{liveSite.business_name || 'My Live Site'}</h3>
                    <p className="text-sm text-gray-500">Template: <span className="capitalize">{liveSite.templateName}</span></p>
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">Edit Live Site &rarr;</span>
                </div>
             </div>
        )}

        {/* Drafts */}
        {drafts.map(draft => (
             <div
                key={draft.id}
                onClick={() => onSelect('draft', draft.id)}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
             >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Draft</span>
                        <span className="text-xs text-gray-400">{new Date(draft.updated_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">{draft.name || draft.business_name || 'Untitled Draft'}</h3>
                     <p className="text-sm text-gray-500">Template: <span className="capitalize">{draft.templateName}</span></p>
                </div>
                 <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
                    <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600 transition-colors">Edit Draft &rarr;</span>
                </div>
             </div>
        ))}

        {/* Empty State if nothing */}
        {!liveSite && drafts.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 mb-4">You haven't created any websites yet.</p>
                <Link href="/templates" className="text-purple-600 font-medium hover:underline">
                    Browse Templates to Get Started
                </Link>
            </div>
        )}
      </div>
    </div>
  )
}

function WebsiteDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ drafts: [], liveSite: null });
  const [editorData, setEditorData] = useState(null); // Data for the editor
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();

  const draftIdParam = searchParams.get('draft_id');
  const siteIdParam = searchParams.get('site_id');

  // 1. Fetch Lists (if no specific ID) OR Fetch Specific (if ID present)
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
             setError("Please log in.");
             setLoading(false);
             return;
        }

        // --- MODE: EDITOR (Specific ID) ---
        if (draftIdParam || siteIdParam) {
             let siteData = null;
             let tmplName = 'flara';

             if (draftIdParam) {
                 const { data: draft } = await supabase.from('website_drafts').select('*').eq('id', draftIdParam).single();
                 if (draft) {
                     siteData = {
                         id: draft.id,
                         data: draft.draft_data,
                         templateId: draft.template_id,
                         slug: null, // Drafts don't have live slugs usually, or use a temp one
                         isDraft: true
                     };
                 }
             } else if (siteIdParam) {
                 const { data: site } = await supabase.from('websites').select('*').eq('id', siteIdParam).single();
                 if (site) {
                     siteData = {
                         id: site.id,
                         data: site.draft_data || site.website_data, // Prefer draft data for editing
                         templateId: site.template_id,
                         slug: site.site_slug,
                         isDraft: false
                     };
                 }
             }

             if (siteData) {
                 // Fetch template name
                 if (siteData.templateId) {
                     const { data: t } = await supabase.from('templates').select('name').eq('id', siteData.templateId).maybeSingle();
                     if (t) tmplName = t.name;
                 }

                 setEditorData({
                     ...siteData,
                     templateName: tmplName
                 });
             } else {
                 setError("Website not found.");
             }

             setLoading(false);
             return;
        }

        // --- MODE: LIST (No ID) ---
        setEditorData(null); // Clear editor data

        // Fetch Live Site
        const { data: site } = await supabase
            .from('websites')
            .select('id, site_slug, template_id, business_name, updated_at')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();

        // Fetch Drafts
        const { data: drafts } = await supabase
            .from('website_drafts')
            .select('id, name, business_name, template_id, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        // Resolve Template Names (Bulk or iterate)
        // Simplified: Fetch all templates first or resolve individually?
        // Let's resolve individually for simplicity as count is low.
        // Or better: Fetch all templates and map.
        const { data: allTemplates } = await supabase.from('templates').select('id, name');
        const templateMap = (allTemplates || []).reduce((acc, t) => ({ ...acc, [t.id]: t.name }), {});

        const processedLive = site ? { ...site, templateName: templateMap[site.template_id] || 'unknown' } : null;
        const processedDrafts = (drafts || []).map(d => ({ ...d, templateName: templateMap[d.template_id] || 'unknown' }));

        setData({
            liveSite: processedLive,
            drafts: processedDrafts
        });

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [draftIdParam, siteIdParam]);

  const handleSelect = (type, id) => {
      const params = new URLSearchParams(searchParams.toString());
      if (type === 'draft') {
          params.set('draft_id', id);
          params.delete('site_id');
      } else {
          params.set('site_id', id);
          params.delete('draft_id');
      }
      router.push(`?${params.toString()}`);
  };

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
            <button onClick={() => window.location.reload()} className="text-purple-600 underline">Try Again</button>
        </div>
    );
  }

  // Render Editor if data present
  if (editorData) {
      return (
        <div className="h-full flex flex-col">
            {/* Optional: specific dashboard header/back button could go here,
                but EditorTopNav handles a lot. Maybe just a "Back to Dashboard" floating button?
                Or rely on Sidebar nav "Website" link reloading the page?
                The Sidebar link usually goes to /dashboard/website which reloads this component.
                If I am in editor mode, clicking "Website" in sidebar (if it's a Link) will reset params?
                Usually Sidebar links are static.
                So user needs a way to go back.
                I will assume the "EditorTopNav" handles navigation or user clicks sidebar.
            */}
            <EditorLayout
                mode="dashboard"
                templateName={editorData.templateName}
                websiteId={!editorData.isDraft ? editorData.id : null}
                draftId={editorData.isDraft ? editorData.id : null} // Pass draftId
                initialData={editorData.data}
                siteSlug={editorData.slug}
            />
        </div>
      );
  }

  // Render List
  return (
    <DraftList
        drafts={data.drafts}
        liveSite={data.liveSite}
        onSelect={handleSelect}
    />
  );
}

export default function WebsiteDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <WebsiteDashboardContent />
    </Suspense>
  );
}
