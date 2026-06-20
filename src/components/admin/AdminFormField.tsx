import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { adminLabelClassName } from "@/lib/admin/forms";

type AdminFormFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

export function AdminFormField({
  label,
  htmlFor,
  hint,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn(className)}>
      <label htmlFor={htmlFor} className={adminLabelClassName}>
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
    </div>
  );
}
