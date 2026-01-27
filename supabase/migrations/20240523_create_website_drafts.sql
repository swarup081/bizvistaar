-- Create website_drafts table
CREATE TABLE IF NOT EXISTS public.website_drafts (
    id bigint GENERATED ALWAYS AS IDENTITY NOT NULL PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id),
    template_id bigint REFERENCES public.templates(id),
    draft_data jsonb,
    name text,
    business_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add columns to websites table
ALTER TABLE public.websites
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS user_name text;

-- Add RLS Policies for website_drafts
ALTER TABLE public.website_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own drafts" ON public.website_drafts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" ON public.website_drafts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" ON public.website_drafts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" ON public.website_drafts
    FOR DELETE USING (auth.uid() = user_id);
