import type { Project } from "@/types";

const ICON_URL_PREFIX = "icon://";
const FORMATTED_TECH_STACK_PREFIX = "__formatted_tech_stack__:";

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[] | null;
  tech_stack_text?: string | null;
  icon?: string | null;
  live_link: string | null;
  github_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export function isIconImageUrl(imageUrl: string | null | undefined): boolean {
  return Boolean(imageUrl?.startsWith(ICON_URL_PREFIX));
}

export function decodeProjectIcon(
  icon: string | null | undefined,
  imageUrl: string | null | undefined,
): string {
  if (icon?.trim()) return icon.trim();
  if (isIconImageUrl(imageUrl)) {
    return imageUrl!.slice(ICON_URL_PREFIX.length).trim() || "folder-kanban";
  }
  return "folder-kanban";
}

export function decodeProjectImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl?.trim() || isIconImageUrl(imageUrl)) return null;
  return imageUrl.trim();
}

export function encodeProjectImageUrl(
  icon: string,
  imageUrl: string | null | undefined,
): string | null {
  if (imageUrl?.trim()) return imageUrl.trim();
  return `${ICON_URL_PREFIX}${icon || "folder-kanban"}`;
}

export function decodeTechStackText(
  techStackText: string | null | undefined,
  techStack: string[] | null | undefined,
): { text: string; tags: string[] } {
  if (techStackText?.trim()) {
    return {
      text: techStackText,
      tags: (techStack ?? []).filter(
        (item) => !item.startsWith(FORMATTED_TECH_STACK_PREFIX),
      ),
    };
  }

  const items = techStack ?? [];
  const encoded = items.find((item) =>
    item.startsWith(FORMATTED_TECH_STACK_PREFIX),
  );

  if (encoded) {
    return {
      text: encoded.slice(FORMATTED_TECH_STACK_PREFIX.length),
      tags: items.filter((item) => !item.startsWith(FORMATTED_TECH_STACK_PREFIX)),
    };
  }

  if (items.length === 0) {
    return { text: "", tags: [] };
  }

  return { text: "", tags: items };
}

export function encodeTechStackArray(
  techStackText: string,
  tags: string[],
): string[] {
  const cleanTags = tags.filter(
    (item) => item.trim() && !item.startsWith(FORMATTED_TECH_STACK_PREFIX),
  );

  if (!techStackText.trim()) {
    return cleanTags;
  }

  return [`${FORMATTED_TECH_STACK_PREFIX}${techStackText}`, ...cleanTags];
}

export function isMissingProjectColumnError(message: string): boolean {
  return /could not find the '(icon|tech_stack_text)' column/i.test(message);
}

export function normalizeProject(row: ProjectRow): Project {
  const techStack = decodeTechStackText(row.tech_stack_text, row.tech_stack);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tech_stack: techStack.tags,
    tech_stack_text: techStack.text,
    icon: decodeProjectIcon(row.icon, row.image_url),
    live_link: row.live_link,
    github_link: row.github_link,
    image_url: decodeProjectImageUrl(row.image_url),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}
