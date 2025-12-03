import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Check if we're in a browser environment (client-side runtime)
const isBrowser = typeof window !== 'undefined';

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialization: only create client when accessed, not at module load time
// This prevents errors during Next.js build/prerendering phase when env vars may not be available
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
  // Return existing client if already created
  if (supabaseClient) {
    return supabaseClient;
  }

  // During build time (server-side), create a dummy client to prevent build errors
  // This client won't be used - it's just to satisfy the module evaluation
  if (!isBrowser) {
    // Use placeholder values during build - these won't be used
    supabaseClient = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key'
    );
    return supabaseClient;
  }

  // At runtime (browser), validate and use real environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    const missingVars = [];
    if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
      `Please ensure these are set in your Vercel project settings.`
    );
  }

  // Create and cache the Supabase client with real values
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

// Export a Proxy that lazily creates the client on first access
// This allows the module to be imported without throwing errors during build
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = (client as any)[prop];
    
    // If it's a function, bind it to the client to preserve 'this' context
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    // Return the property value
    return value;
  }
});

