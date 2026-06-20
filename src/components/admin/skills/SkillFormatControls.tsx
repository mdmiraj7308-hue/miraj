"use client";

import { FormattedTextEditor, type FormattedTextValue } from "@/components/admin/FormattedTextEditor";
import { SkillMarkdown } from "@/components/ui/SkillMarkdown";
import { cn } from "@/lib/utils";
import { textAlignClass, textFontSizeClass } from "@/lib/admin/formatted-text";
import type { SkillFontSize, SkillTextAlign } from "@/types";

export type SkillFormatState = {
  text: string;
  font_size: SkillFontSize;
  text_align: SkillTextAlign;
};

type SkillFormatControlsProps = {
  value: SkillFormatState;
  onChange: (value: SkillFormatState) => void;
  textareaId: string;
  textareaName?: string;
  required?: boolean;
};

export function SkillFormatControls({
  value,
  onChange,
  textareaId,
  textareaName = "text",
  required = false,
}: SkillFormatControlsProps) {
  return (
    <FormattedTextEditor
      id={textareaId}
      textName={textareaName}
      fontSizeName="font_size"
      alignName="text_align"
      value={value}
      onChange={onChange}
      required={required}
      placeholder='e.g. **AI Orchestration**: LangGraph, **LangChain**, Stateful Multi-Agent Workflows'
    />
  );
}

export function SkillTextPreview({
  text,
  font_size,
  text_align,
}: SkillFormatState) {
  if (!text) return null;

  return (
    <SkillMarkdown
      content={text}
      className={cn(
        textFontSizeClass(font_size),
        textAlignClass(text_align),
        "text-gray-800",
      )}
      strongClassName="font-bold text-gray-900"
    />
  );
}

export type { FormattedTextValue };
