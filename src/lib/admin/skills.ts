import { parseFormattedStorage, serializeFormattedStorage } from "@/lib/admin/formatted-text";
import type { Skill, SkillCategory } from "@/types";
import type { TextAlign, TextFontSize } from "@/lib/admin/formatted-text";

export type SkillFontSize = TextFontSize;
export type SkillTextAlign = TextAlign;

export {
  parseTextFontSize as parseSkillFontSize,
  parseTextAlign as parseSkillTextAlign,
  textFontSizeClass as skillFontSizeClass,
  textAlignClass as skillTextAlignClass,
  wrapTextSelection,
} from "@/lib/admin/formatted-text";

export function parseSkillCategory(value: string): SkillCategory {
  return value === "tool" ? "tool" : "technical";
}

export function parseSkillStorage(name: string) {
  return parseFormattedStorage(name);
}

export function serializeSkillStorage(skill: {
  text: string;
  font_size: TextFontSize;
  text_align: TextAlign;
}) {
  return serializeFormattedStorage(skill);
}

type SkillRow = {
  id: string;
  name: string;
  category?: SkillCategory | null;
  sort_order: number;
};

export function normalizeSkill(row: SkillRow): Skill {
  const parsed = parseFormattedStorage(row.name);

  return {
    id: row.id,
    text: parsed.text,
    category: parseSkillCategory(row.category ?? "technical"),
    font_size: parsed.font_size,
    text_align: parsed.text_align,
    sort_order: row.sort_order,
  };
}
