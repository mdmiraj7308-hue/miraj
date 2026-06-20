"use server";

import {
  getFormString,
  requireAuth,
  revalidateAdmin,
  type ActionState,
} from "@/lib/admin/action-utils";
import {
  parseSkillCategory,
  parseSkillFontSize,
  parseSkillTextAlign,
  serializeSkillStorage,
} from "@/lib/admin/skills";

export async function saveSkill(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const id = getFormString(formData, "id");
  const text = getFormString(formData, "text");
  const category = parseSkillCategory(getFormString(formData, "category"));
  const fontSize = parseSkillFontSize(getFormString(formData, "font_size") || "base");
  const textAlign = parseSkillTextAlign(
    getFormString(formData, "text_align") || "left",
  );

  if (!text) return { error: "Skill text is required." };

  const payload = {
    name: serializeSkillStorage({
      text,
      font_size: fontSize,
      text_align: textAlign,
    }),
    category,
    level: 0,
  };

  if (id) {
    const { error } = await supabase.from("skills").update(payload).eq("id", id);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/skills");
    return { success: "Skill updated." };
  }

  const { data: lastSkill } = await supabase
    .from("skills")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = (lastSkill?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("skills").insert({
    ...payload,
    sort_order: sortOrder,
  });

  if (error) return { error: error.message };

  revalidateAdmin("/admin/skills");
  return { success: "Skill added." };
}

export async function deleteSkill(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  if (!id) return;

  await supabase.from("skills").delete().eq("id", id);
  revalidateAdmin("/admin/skills");
}
