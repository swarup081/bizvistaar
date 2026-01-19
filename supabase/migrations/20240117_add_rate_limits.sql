
-- Migration: Add rate_limits table
-- This script is idempotent

CREATE TABLE IF NOT EXISTS public.rate_limits (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    ip_address text,
    endpoint text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Index for fast lookup/counting
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_created ON public.rate_limits (ip_address, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_created ON public.rate_limits (user_id, created_at);
