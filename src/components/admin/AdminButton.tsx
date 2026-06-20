import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export function AdminButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-theme text-white hover:bg-theme-light",
        variant === "secondary" &&
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        variant === "danger" &&
          "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        variant === "ghost" && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className,
      )}
      {...props}
    />
  );
}
