import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard: during Vercel build-time pre-rendering the env vars may be absent.
// Pages that genuinely need Supabase are marked `force-dynamic` so they never
// execute this code at build time; this guard is a safety net for everything else.
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;