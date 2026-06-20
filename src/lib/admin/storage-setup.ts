import { createClient } from "@/lib/supabase/server";

export async function isPortfolioStorageConfigured(): Promise<boolean> {
  try {
    const supabase = await createClient();
    // getBucket() requires admin rights and returns false negatives with the anon key.
    // Listing objects works for public buckets and is enough to verify setup.
    const { error } = await supabase.storage.from("portfolio").list("avatars", {
      limit: 1,
    });
    return !error;
  } catch {
    return false;
  }
}

export const PORTFOLIO_STORAGE_SETUP_HINT =
  'Run supabase/migrations/002_storage_avatars.sql in the Supabase SQL Editor to enable photo uploads (creates the "portfolio" storage bucket).';
