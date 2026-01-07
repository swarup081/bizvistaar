-- Migration to enable RLS and policies for client_analytics

-- 1. Enable RLS
ALTER TABLE public.client_analytics ENABLE ROW LEVEL SECURITY;

-- 2. Allow anonymous inserts (for public website traffic tracking)
-- We allow anyone to insert, as long as they provide a valid website_id (FK constraint handles validity)
-- Ideally, we'd check if the website is actually public, but a simple public insert is standard for analytics.
CREATE POLICY "Allow public insert to client_analytics"
ON public.client_analytics
FOR INSERT
WITH CHECK (true);

-- 3. Allow website owners to view their own analytics
-- Assumes auth.uid() matches the owner of the website linked to the analytics.
-- We need to join with websites table to check ownership.
CREATE POLICY "Allow owners to view their website analytics"
ON public.client_analytics
FOR SELECT
USING (
  website_id IN (
    SELECT id FROM public.websites
    WHERE user_id = auth.uid()
  )
);
