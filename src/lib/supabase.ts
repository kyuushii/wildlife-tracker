import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  // Check environment variables first
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check client-side custom config from settings
  let localUrl = '';
  let localKey = '';
  if (typeof window !== 'undefined') {
    localUrl = localStorage.getItem('cp_supabase_url') || '';
    localKey = localStorage.getItem('cp_supabase_anon_key') || '';
  }

  const url = envUrl || localUrl;
  const key = envKey || localKey;

  if (!url || !key) {
    return null;
  }

  try {
    cachedClient = createClient(url, key);
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function resetSupabaseClient(): void {
  cachedClient = null;
}
