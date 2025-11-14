// src/lib/supabaseServer.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabaseServer = null;

if (supabaseUrl && supabaseServiceKey) {
  supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('Supabase server client is not initialized. Missing SUPABASE_URL or SUPABASE_SERVICE_KEY.');
}

export { supabaseServer };
