import { cn } from "@/lib/utils";
import { RichTextContent } from "@/components/ui/RichTextContent";

type SkillMarkdownProps = {
  content: string;
  className?: string;
  strongClassName?: string;
  compact?: boolean;
};

export function SkillMarkdown({
  content,
  className,
  strongClassName = "font-bold text-white",
  compact = false,
}: SkillMarkdownProps) {
  return (
    <RichTextContent
      content={content}
      className={className}
      strongClassName={strongClassName}
      compact={compact}
    />
  );
}
