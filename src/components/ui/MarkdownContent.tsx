import { cn } from "@/lib/utils";
import { RichTextContent } from "@/components/ui/RichTextContent";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <RichTextContent
      content={content}
      className={cn("text-sm text-gray-300", className)}
      strongClassName="font-semibold text-white"
    />
  );
}
