"use server";

import {
  getFormOptionalString,
  getFormString,
  parseCommaList,
  requireAuth,
  revalidateAdmin,
  type ActionState,
} from "@/lib/admin/action-utils";
import {
  serializeFormattedField,
  stripFormattingMarkup,
} from "@/lib/admin/formatted-text";
import {
  encodeProjectImageUrl,
  encodeTechStackArray,
  isMissingProjectColumnError,
} from "@/lib/admin/projects";
import { uploadProjectIcon } from "@/lib/admin/storage";

function getImageFile(formData: FormData, fieldName: string): File | null {
  const value = formData.get(fieldName);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  return value;
}

export async function saveProject(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const id = getFormString(formData, "id");
  const titleRaw = serializeFormattedField(formData, "title");
  if (!stripFormattingMarkup(titleRaw)) {
    return { error: "Title is required." };
  }

  const icon = getFormString(formData, "icon") || "folder-kanban";
  const removeIcon = formData.get("remove_icon") === "on";
  let imageUrl = removeIcon
    ? null
    : getFormOptionalString(formData, "image_url");
  const iconFile = getImageFile(formData, "project_icon");
  const techStackText = serializeFormattedField(formData, "tech_stack_text");
  const techStackPlain = stripFormattingMarkup(techStackText);
  const techStackTags = parseCommaList(techStackPlain.replace(/\n/g, ","));

  const extendedPayload = {
    title: titleRaw,
    description: serializeFormattedField(formData, "description"),
    tech_stack_text: techStackText,
    tech_stack: techStackTags,
    icon,
    live_link: getFormOptionalString(formData, "live_link"),
    github_link: getFormOptionalString(formData, "github_link"),
    image_url: imageUrl,
  };

  const legacyPayload = {
    title: titleRaw,
    description: serializeFormattedField(formData, "description"),
    tech_stack: encodeTechStackArray(techStackText, techStackTags),
    live_link: getFormOptionalString(formData, "live_link"),
    github_link: getFormOptionalString(formData, "github_link"),
    image_url: encodeProjectImageUrl(icon, imageUrl),
  };

  let projectId = id || null;
  let error: { message: string } | null = null;

  if (id) {
    ({ error } = await supabase.from("projects").update(extendedPayload).eq("id", id));
  } else {
    const { data, error: insertError } = await supabase
      .from("projects")
      .insert(extendedPayload)
      .select("id")
      .single();
    error = insertError;
    projectId = data?.id ?? null;
  }

  if (error && isMissingProjectColumnError(error.message)) {
    if (id) {
      ({ error } = await supabase.from("projects").update(legacyPayload).eq("id", id));
      projectId = id;
    } else {
      const { data, error: insertError } = await supabase
        .from("projects")
        .insert(legacyPayload)
        .select("id")
        .single();
      error = insertError;
      projectId = data?.id ?? null;
    }
  }

  if (error) return { error: error.message };
  if (!projectId) return { error: "Could not save project." };

  if (iconFile) {
    const upload = await uploadProjectIcon(supabase, iconFile, projectId);
    if ("error" in upload) return { error: upload.error };

    imageUrl = upload.url;
    const iconUpdate = { image_url: imageUrl };
    const { error: iconError } = await supabase
      .from("projects")
      .update(iconUpdate)
      .eq("id", projectId);

    if (iconError && isMissingProjectColumnError(iconError.message)) {
      await supabase
        .from("projects")
        .update({ image_url: encodeProjectImageUrl(icon, imageUrl) })
        .eq("id", projectId);
    } else if (iconError) {
      return { error: iconError.message };
    }
  }

  revalidateAdmin("/admin/projects");
  return { success: id ? "Project updated." : "Project added." };
}

export async function deleteProject(formData: FormData): Promise<void> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return;

  const id = getFormString(formData, "id");
  if (!id) return;

  await supabase.from("projects").delete().eq("id", id);
  revalidateAdmin("/admin/projects");
}
