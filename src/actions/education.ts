"use server";

import {
  getFormString,
  parseNumber,
  requireAuth,
  revalidateAdmin,
  type ActionState,
} from "@/lib/admin/action-utils";

export async function saveEducation(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const id = getFormString(formData, "id");
  const degree = getFormString(formData, "degree");
  const institution = getFormString(formData, "institution");
  const dateRange = getFormString(formData, "date_range");

  if (!degree) return { error: "Degree is required." };
  if (!institution) return { error: "Institution is required." };
  if (!dateRange) return { error: "Date range is required." };

  const payload = {
    degree,
    institution,
    date_range: dateRange,
    icon: getFormString(formData, "icon") || "graduation-cap",
    sort_order: parseNumber(formData, "sort_order", 0),
  };

  const { error } = id
    ? await supabase.from("education").update(payload).eq("id", id)
    : await supabase.from("education").insert(payload);

  if (error) return { error: error.message };

  revalidateAdmin("/admin/education");
  return { success: id ? "Education entry updated." : "Education entry added." };
}

export async function deleteEducation(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  if (!id) return;

  await supabase.from("education").delete().eq("id", id);
  revalidateAdmin("/admin/education");
}
