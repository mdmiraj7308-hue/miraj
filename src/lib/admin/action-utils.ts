import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  error?: string;
  success?: string;
};

export function getFormString(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function getFormOptionalString(
  formData: FormData,
  key: string,
): string | null {
  const value = getFormString(formData, key);
  return value || null;
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseNewlineList(value: string): string[] {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseNumber(
  formData: FormData,
  key: string,
  fallback = 0,
): number {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export function revalidateAdmin(adminPath: string) {
  revalidatePath(adminPath);
  revalidatePath("/");
}

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "You must be signed in." as const };
  }

  return { supabase, user, error: null };
}
