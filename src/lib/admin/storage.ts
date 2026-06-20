import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const PORTFOLIO_BUCKET = "portfolio";
const HERO_AVATAR_PATH = "avatars/hero";
const ABOUT_AVATAR_PATH = "avatars/about";
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 5 * 1024 * 1024;

function extensionForMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export async function uploadPortfolioImage(
  supabase: SupabaseClient<Database>,
  file: File,
  storagePath: string,
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Please upload a JPEG, PNG, WebP, or GIF image." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image must be smaller than 5 MB." };
  }

  const ext = extensionForMime(file.type);
  const path = `${storagePath}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    const message = error.message.toLowerCase().includes("bucket")
      ? 'Photo storage is not set up yet. In Supabase, open SQL Editor and run the file supabase/migrations/002_storage_avatars.sql, then try again.'
      : error.message;

    return { error: message };
  }

  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);

  return { url: `${data.publicUrl}?v=${Date.now()}` };
}

export async function uploadHeroAvatar(
  supabase: SupabaseClient<Database>,
  file: File,
): Promise<{ url: string } | { error: string }> {
  return uploadPortfolioImage(supabase, file, HERO_AVATAR_PATH);
}

export async function uploadAboutAvatar(
  supabase: SupabaseClient<Database>,
  file: File,
): Promise<{ url: string } | { error: string }> {
  return uploadPortfolioImage(supabase, file, ABOUT_AVATAR_PATH);
}

export async function uploadProjectIcon(
  supabase: SupabaseClient<Database>,
  file: File,
  projectId: string,
): Promise<{ url: string } | { error: string }> {
  return uploadPortfolioImage(
    supabase,
    file,
    `projects/icons/${projectId}`,
  );
}
