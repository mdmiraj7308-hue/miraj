"use server";

import {
  getFormString,
  parseCommaList,
  parseNumber,
  requireAuth,
  revalidateAdmin,
  type ActionState,
} from "@/lib/admin/action-utils";
import { serializeFormattedField } from "@/lib/admin/formatted-text";

export async function saveExperience(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const id = getFormString(formData, "id");
  const title = getFormString(formData, "title");
  const company = getFormString(formData, "company");
  const dateRange = getFormString(formData, "date_range");

  if (!title) return { error: "Title is required." };
  if (!company) return { error: "Company is required." };
  if (!dateRange) return { error: "Date range is required." };

  const payload = {
    title,
    company,
    date_range: dateRange,
    description: serializeFormattedField(formData, "description"),
    skills: parseCommaList(getFormString(formData, "skills")),
    icon: getFormString(formData, "icon") || "briefcase",
    sort_order: parseNumber(formData, "sort_order", 0),
  };

  const { error } = id
    ? await supabase.from("experiences").update(payload).eq("id", id)
    : await supabase.from("experiences").insert(payload);

  if (error) return { error: error.message };

  revalidateAdmin("/admin/experience");
  return { success: id ? "Experience updated." : "Experience added." };
}

export async function deleteExperience(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  if (!id) return;

  await supabase.from("experiences").delete().eq("id", id);
  revalidateAdmin("/admin/experience");
}
