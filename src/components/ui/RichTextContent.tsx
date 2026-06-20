import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type RichTextContentProps = {
  content: string;
  className?: string;
  strongClassName?: string;
  compact?: boolean;
};

export function RichTextContent({
  content,
  className,
  strongClassName = "font-semibold text-white",
  compact = false,
}: RichTextContentProps) {
  const paragraphClass = compact ? "mb-2 last:mb-0" : "mb-3 last:mb-0";

  return (
    <div className={cn("leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children }) => (
            <h4 className="mb-2 text-base font-semibold text-inherit">{children}</h4>
          ),
          h2: ({ children }) => (
            <h4 className="mb-2 text-base font-semibold text-inherit">{children}</h4>
          ),
          h3: ({ children }) => (
            <h5 className="mb-2 text-sm font-semibold text-inherit">{children}</h5>
          ),
          p: ({ children }) => <p className={paragraphClass}>{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-theme-light underline underline-offset-2"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-inherit">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className={strongClassName}>{children}</strong>
          ),
          br: () => <br />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
