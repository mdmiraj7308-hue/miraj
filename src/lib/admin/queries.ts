import { createClient } from "@/lib/supabase/server";
import { normalizeProject } from "@/lib/admin/projects";
import { normalizeSkill } from "@/lib/admin/skills";
import {
  defaultAboutContent,
  defaultBioContent,
  defaultContactContent,
} from "@/lib/admin/defaults";
import type {
  AboutContent,
  BioContent,
  ContactContent,
  ContactMessage,
  Education,
  Experience,
  Project,
  SiteContentKey,
  Skill,
} from "@/types";

async function getSiteContentByKey<T>(key: SiteContentKey, fallback: T): Promise<T> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", key)
    .maybeSingle();

  if (!data?.content || typeof data.content !== "object") {
    return fallback;
  }

  return { ...fallback, ...(data.content as T) };
}

function normalizeAboutContent(raw: Record<string, unknown>): AboutContent {
  const paragraphs = raw.paragraphs;
  const bodyFromParagraphs = Array.isArray(paragraphs)
    ? paragraphs
        .filter((item): item is string => typeof item === "string")
        .join("\n\n")
    : "";

  return {
    title:
      typeof raw.title === "string" ? raw.title : defaultAboutContent.title,
    intro_title:
      typeof raw.intro_title === "string"
        ? raw.intro_title
        : typeof raw.left_card_title === "string"
          ? raw.left_card_title
          : defaultAboutContent.intro_title,
    avatar_url:
      typeof raw.avatar_url === "string" && raw.avatar_url.trim()
        ? raw.avatar_url
        : null,
    location: typeof raw.location === "string" ? raw.location : "",
    education:
      typeof raw.education === "string"
        ? raw.education
        : typeof raw.education_short === "string"
          ? raw.education_short
          : "",
    body_text:
      typeof raw.body_text === "string"
        ? raw.body_text
        : bodyFromParagraphs,
  };
}

export async function getBioContent(): Promise<BioContent> {
  return getSiteContentByKey("bio", defaultBioContent);
}

export async function getAboutContent(): Promise<AboutContent> {
  const raw = await getSiteContentByKey("about", defaultAboutContent);
  return normalizeAboutContent(raw as unknown as Record<string, unknown>);
}

export async function getContactContent(): Promise<ContactContent> {
  return getSiteContentByKey("contact", defaultContactContent);
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  return (data ?? []).map(normalizeSkill);
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []).map(normalizeProject);
}

export async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getEducationEntries(): Promise<Education[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}
