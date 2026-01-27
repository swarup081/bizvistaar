import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { websiteId, draftId, websiteData, templateId, templateName, name } = await req.json()

    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    let resultData;
    let error;

    if (draftId) {
        // Update existing draft in website_drafts
        const { data, error: updateError } = await supabase
            .from('website_drafts')
            .update({
                draft_data: websiteData,
                updated_at: new Date(),
                ...(name ? { name } : {})
             })
            .eq('id', draftId)
            .eq('user_id', user.id)
            .select()
            .single();

        resultData = { draftId: draftId };
        error = updateError;

    } else if (websiteId) {
        // Update existing Main Website (Draft Column)
        const { data, error: updateError } = await supabase
            .from('websites')
            .update({ draft_data: websiteData, updated_at: new Date() })
            .eq('id', websiteId)
            .eq('user_id', user.id)
            .select()
            .single();

        resultData = { websiteId: websiteId };
        error = updateError;

    } else {
        // Create NEW Draft
        let finalTemplateId = templateId;

        // Look up template ID if not provided but name is
        if (!finalTemplateId && templateName) {
             const { data: tData } = await supabase
                .from('templates')
                .select('id')
                .eq('name', templateName)
                .single();
             if (tData) finalTemplateId = tData.id;
        }

        const { data, error: insertError } = await supabase
            .from('website_drafts')
            .insert({
                user_id: user.id,
                template_id: finalTemplateId || null,
                draft_data: websiteData,
                name: name || 'Untitled Draft',
                business_name: websiteData?.businessName || '',
                created_at: new Date(),
                updated_at: new Date()
            })
            .select('id')
            .single();

        if (data) {
            resultData = { draftId: data.id };
        }
        error = insertError;
    }

    if (error) {
      console.error("Save Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify({ message: 'Saved successfully', ...resultData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
      console.error("Request Error:", err);
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
  }
})
