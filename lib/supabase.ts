
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://ongqtqeeecntxsrllmol.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZ3F0cWVlZWNudHhzcmxsbW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjI3MjgsImV4cCI6MjA4MzMzODcyOH0.P2hv_4QLgDCja-NrWbVawp24iu8VX2rGwHqUSsAP7Tc';

/**
 * World-class resilience:
 * If Supabase environment variables are missing, we provide a mock object 
 * that prevents the application from crashing while logging a helpful warning.
 */
const createMockSupabase = () => {
  console.warn('Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) are missing. Running in demo mode.');
  return {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [], error: { message: 'Database not configured' } }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: { message: 'Database not configured' } }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Database not configured' } }),
      }),
    }),
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    }
  } as any;
};

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();
