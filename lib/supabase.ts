import { createClient } from '@supabase/supabase-js';

// Read environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Strict check with detailed error message for debugging
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  throw new Error(
    `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
    `Please ensure these are set in your Vercel project settings.`
  );
}

// Create Supabase client with validated variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

