import { cn } from "@/lib/utils";

type AdminAlertProps = {
  variant: "error" | "success";
  message: string;
  className?: string;
};

export function AdminAlert({ variant, message, className }: AdminAlertProps) {
  return (
    <p
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        variant === "error"
          ? "border border-red-200 bg-red-50 text-red-700"
          : "border border-emerald-200 bg-emerald-50 text-emerald-700",
        className,
      )}
    >
      {message}
    </p>
  );
}
