export type TextFontSize = "sm" | "base" | "lg" | "xl";
export type TextAlign = "left" | "center" | "right";

export type FormattedTextValue = {
  text: string;
  font_size: TextFontSize;
  text_align: TextAlign;
};

const FONT_SIZES = new Set<TextFontSize>(["sm", "base", "lg", "xl"]);
const TEXT_ALIGNS = new Set<TextAlign>(["left", "center", "right"]);
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

export function parseTextFontSize(value: string): TextFontSize {
  return FONT_SIZES.has(value as TextFontSize) ? (value as TextFontSize) : "base";
}

export function parseTextAlign(value: string): TextAlign {
  return TEXT_ALIGNS.has(value as TextAlign) ? (value as TextAlign) : "left";
}

export function textFontSizeClass(size: TextFontSize): string {
  switch (size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "text-lg";
    case "xl":
      return "text-xl";
    default:
      return "text-base";
  }
}

export function textAlignClass(align: TextAlign): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

export function parseFormattedStorage(stored: string): FormattedTextValue {
  const trimmed = stored.trim();
  const match = trimmed.match(FRONTMATTER_REGEX);

  if (!match) {
    return { text: trimmed, font_size: "base", text_align: "left" };
  }

  let font_size: TextFontSize = "base";
  let text_align: TextAlign = "left";

  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (key === "size") font_size = parseTextFontSize(value);
    if (key === "align") text_align = parseTextAlign(value);
  }

  return {
    text: match[2].trim(),
    font_size,
    text_align,
  };
}

export function serializeFormattedStorage(value: FormattedTextValue): string {
  const text = value.text.trim();
  const needsMeta = value.font_size !== "base" || value.text_align !== "left";

  if (!needsMeta) return text;

  return `---\nsize: ${value.font_size}\nalign: ${value.text_align}\n---\n${text}`;
}

export function stripFormattingMarkup(text: string): string {
  const parsed = parseFormattedStorage(text);
  return parsed.text.replace(/\*\*/g, "");
}

export function wrapTextSelection(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  wrapper: string,
): { text: string; selectionStart: number; selectionEnd: number } {
  const before = text.slice(0, selectionStart);
  const selected = text.slice(selectionStart, selectionEnd);
  const after = text.slice(selectionEnd);
  const inner = selected || "text";
  const wrapped = `${wrapper}${inner}${wrapper}`;

  return {
    text: `${before}${wrapped}${after}`,
    selectionStart: before.length + wrapper.length,
    selectionEnd: before.length + wrapper.length + inner.length,
  };
}

export function formattedValueFromForm(
  formData: FormData,
  textKey: string,
  fontSizeKey?: string,
  alignKey?: string,
): FormattedTextValue {
  return {
    text: String(formData.get(textKey) ?? "").trim(),
    font_size: parseTextFontSize(
      String(formData.get(fontSizeKey ?? `${textKey}_font_size`) ?? "base"),
    ),
    text_align: parseTextAlign(
      String(formData.get(alignKey ?? `${textKey}_text_align`) ?? "left"),
    ),
  };
}

export function serializeFormattedField(
  formData: FormData,
  textKey: string,
  fontSizeKey?: string,
  alignKey?: string,
): string {
  return serializeFormattedStorage(
    formattedValueFromForm(formData, textKey, fontSizeKey, alignKey),
  );
}
