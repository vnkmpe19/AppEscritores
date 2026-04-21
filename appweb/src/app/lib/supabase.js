import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client initialization with "placeholder" fallback.
 * This prevents the build from crashing when environment variables are missing
 * during the static analysis phase (Next.js build).
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

// Always export a client instance to avoid build-time "URL required" errors.
// At runtime, if the variables are missing, queries will naturally fail but the
// initialization won't crash the server-side module evaluation.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
