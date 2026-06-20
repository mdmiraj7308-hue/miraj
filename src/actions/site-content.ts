"use server";

import {
  getFormOptionalString,
  getFormString,
  parseNewlineList,
  requireAuth,
  revalidateAdmin,
  type ActionState,
} from "@/lib/admin/action-utils";
import { serializeFormattedField } from "@/lib/admin/formatted-text";
import { uploadHeroAvatar, uploadAboutAvatar } from "@/lib/admin/storage";
import { isValidWhatsAppUrl, normalizeWhatsAppUrl } from "@/lib/whatsapp";
import type { AboutContent, BioContent, ContactContent, SocialLink } from "@/types";

function getImageFile(formData: FormData, fieldName: string): File | null {
  const value = formData.get(fieldName);
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  return value;
}

function getAvatarFile(formData: FormData): File | null {
  return getImageFile(formData, "avatar");
}

async function upsertSiteContent(
  key: "bio" | "about" | "contact",
  content: BioContent | AboutContent | ContactContent,
  adminPath: string,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", key)
    .maybeSingle();

  const payload = { key, content };

  const { error } = existing
    ? await supabase.from("site_content").update(payload).eq("id", existing.id)
    : await supabase.from("site_content").insert(payload);

  if (error) return { error: error.message };

  revalidateAdmin(adminPath);
  return { success: "Changes saved successfully." };
}

export async function updateBio(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const name = getFormString(formData, "name");
  if (!name) return { error: "Name is required." };

  const removeAvatar = formData.get("remove_avatar") === "on";
  let avatarUrl = removeAvatar
    ? null
    : getFormOptionalString(formData, "avatar_url");

  const avatarFile = getAvatarFile(formData);
  if (avatarFile) {
    const upload = await uploadHeroAvatar(supabase, avatarFile);
    if ("error" in upload) return { error: upload.error };
    avatarUrl = upload.url;
  }

  const content: BioContent = {
    name,
    typed_roles: parseNewlineList(getFormString(formData, "typed_roles")),
    summary: serializeFormattedField(formData, "summary"),
    hero_icon: getFormString(formData, "hero_icon") || "user",
    avatar_url: avatarUrl,
    cta_primary_label: getFormString(formData, "cta_primary_label") || "View Projects",
    cta_primary_href: getFormString(formData, "cta_primary_href") || "#projects",
    cta_secondary_label:
      getFormString(formData, "cta_secondary_label") || "Contact Me",
    cta_secondary_href:
      getFormString(formData, "cta_secondary_href") || "#contact",
  };

  return upsertSiteContent("bio", content, "/admin/bio");
}

export async function updateAbout(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const { supabase, error: authError } = await requireAuth();
  if (authError) return { error: authError };

  const title = getFormString(formData, "title");
  if (!title) return { error: "Title is required." };

  const removeAvatar = formData.get("remove_avatar") === "on";
  let avatarUrl = removeAvatar
    ? null
    : getFormOptionalString(formData, "avatar_url");

  const avatarFile = getImageFile(formData, "about_avatar");
  if (avatarFile) {
    const upload = await uploadAboutAvatar(supabase, avatarFile);
    if ("error" in upload) return { error: upload.error };
    avatarUrl = upload.url;
  }

  const content: AboutContent = {
    title,
    intro_title: getFormString(formData, "intro_title") || "My intro",
    avatar_url: avatarUrl,
    location: getFormString(formData, "location"),
    education: getFormString(formData, "education"),
    body_text: serializeFormattedField(formData, "body_text"),
  };

  return upsertSiteContent("about", content, "/admin/about");
}

function parseSocialLinks(formData: FormData): SocialLink[] {
  const raw = getFormString(formData, "social_links_json");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item): item is SocialLink =>
          typeof item === "object" &&
          item !== null &&
          typeof item.name === "string" &&
          typeof item.url === "string" &&
          typeof item.icon === "string",
      )
      .map((item) => ({
        name: item.name.trim(),
        url: item.url.trim(),
        icon: item.icon.trim() || "link",
      }))
      .filter((item) => item.name && item.url);
  } catch {
    return [];
  }
}

export async function updateContact(
  _prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState | null> {
  const title = getFormString(formData, "title");
  if (!title) return { error: "Title is required." };

  const notificationEmail = getFormString(formData, "notification_email");
  if (
    notificationEmail &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)
  ) {
    return { error: "Please enter a valid notification email address." };
  }

  const whatsappUrl = normalizeWhatsAppUrl(getFormString(formData, "whatsapp_url"));
  if (whatsappUrl && !isValidWhatsAppUrl(whatsappUrl)) {
    return {
      error:
        "Please enter a valid WhatsApp link (e.g. https://wa.me/1234567890 or a phone number).",
    };
  }

  const content: ContactContent = {
    title,
    form_title: getFormString(formData, "form_title") || "Send a Message",
    connect_title: getFormString(formData, "connect_title") || "Send Messages",
    notification_email: notificationEmail,
    whatsapp_url: whatsappUrl,
    social_links: parseSocialLinks(formData),
  };

  return upsertSiteContent("contact", content, "/admin/contact");
}
