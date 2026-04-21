import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Log values during build to diagnose Vercel/Local build issues
if (typeof window === 'undefined') {
  console.log("Supabase Init Check:", {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValue: supabaseUrl ? (supabaseUrl.substring(0, 10) + "...") : "MISSING"
  });
}

const isSafeToInit = supabaseUrl && 
                     supabaseAnonKey && 
                     supabaseUrl !== "undefined" && 
                     supabaseUrl.startsWith("http");

export const supabase = isSafeToInit
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
