"use client";

import { useRef } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  textAlignClass,
  textFontSizeClass,
  wrapTextSelection,
  type FormattedTextValue,
  type TextFontSize,
} from "@/lib/admin/formatted-text";
import { RichTextContent } from "@/components/ui/RichTextContent";

const FONT_SIZE_OPTIONS: { value: TextFontSize; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "base", label: "Normal" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra large" },
];

function ToolbarButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
    >
      {children}
    </button>
  );
}

type FormattedTextEditorProps = {
  id: string;
  textName: string;
  fontSizeName?: string;
  alignName?: string;
  value: FormattedTextValue;
  onChange: (value: FormattedTextValue) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  previewClassName?: string;
  strongClassName?: string;
};

export function FormattedTextEditor({
  id,
  textName,
  fontSizeName,
  alignName,
  value,
  onChange,
  required = false,
  rows = 4,
  placeholder,
  previewClassName,
  strongClassName = "font-bold text-gray-900",
}: FormattedTextEditorProps) {
  const fontSizeField = fontSizeName ?? `${textName}_font_size`;
  const alignField = alignName ?? `${textName}_text_align`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyBoldToSelection() {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { text, selectionStart, selectionEnd } = wrapTextSelection(
      value.text,
      textarea.selectionStart,
      textarea.selectionEnd,
      "**",
    );

    onChange({ ...value, text });

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
        <ToolbarButton label="Bold selected text" onClick={applyBoldToSelection}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <span className="text-xs text-gray-500">
          Select words, then click B for **bold**
        </span>

        <label className="sr-only" htmlFor={`${id}-font-size`}>
          Font size
        </label>
        <select
          id={`${id}-font-size`}
          name={fontSizeField}
          value={value.font_size}
          onChange={(event) =>
            onChange({
              ...value,
              font_size: event.target.value as TextFontSize,
            })
          }
          className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-theme"
        >
          {FONT_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <ToolbarButton
            label="Align left"
            onClick={() => onChange({ ...value, text_align: "left" })}
          >
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align center"
            onClick={() => onChange({ ...value, text_align: "center" })}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            onClick={() => onChange({ ...value, text_align: "right" })}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <input type="hidden" name={alignField} value={value.text_align} />

      <textarea
        ref={textareaRef}
        id={id}
        name={textName}
        value={value.text}
        required={required}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange({ ...value, text: event.target.value })}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 font-mono text-sm text-gray-900 outline-none focus:border-theme"
      />

      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/80 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
          Preview
        </p>
        <RichTextContent
          content={value.text || "Preview will appear here."}
          className={cn(
            textFontSizeClass(value.font_size),
            textAlignClass(value.text_align),
            previewClassName ?? "text-gray-800",
          )}
          strongClassName={strongClassName}
        />
      </div>
    </div>
  );
}

export type { FormattedTextValue };
