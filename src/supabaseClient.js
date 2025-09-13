import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aesrcoazqckepnitqump.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlc3Jjb2F6cWNrZXBuaXRxdW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NzcxMDYsImV4cCI6MjA3MzI1MzEwNn0.G951ULPWlls4UYflD5YSVfvvsWCakNzFndy-5c_LCvI';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase env vars are missing. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
  }
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
