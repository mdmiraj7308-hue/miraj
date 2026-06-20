import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "@/config/env";
import type { Database } from "./database.types";

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseEnv();
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
