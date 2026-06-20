import { cn } from "@/lib/utils";
import {
  parseFormattedStorage,
  textAlignClass,
  textFontSizeClass,
} from "@/lib/admin/formatted-text";
import { RichTextContent } from "@/components/ui/RichTextContent";

type FormattedTextDisplayProps = {
  stored: string;
  className?: string;
  strongClassName?: string;
  markdown?: boolean;
};

export function FormattedTextDisplay({
  stored,
  className,
  strongClassName = "font-bold text-white",
  markdown = false,
}: FormattedTextDisplayProps) {
  const parsed = parseFormattedStorage(stored);

  if (!parsed.text) return null;

  const wrapperClass = cn(
    textFontSizeClass(parsed.font_size),
    textAlignClass(parsed.text_align),
    className,
  );

  if (markdown) {
    return (
      <div className={wrapperClass}>
        <RichTextContent
          content={parsed.text}
          className="text-inherit"
          strongClassName={strongClassName}
        />
      </div>
    );
  }

  return (
    <RichTextContent
      content={parsed.text}
      className={wrapperClass}
      strongClassName={strongClassName}
      compact
    />
  );
}

export function getPlainFormattedPreview(stored: string, maxLength = 120): string {
  const parsed = parseFormattedStorage(stored);
  const plain = parsed.text.replace(/\*\*/g, "").replace(/\n/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
}
