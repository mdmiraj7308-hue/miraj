import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "default" | "warning" | "success";
};

const accentStyles = {
  default: "bg-theme/10 text-theme",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
};

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "default",
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {hint ? <p className="mt-2 text-xs text-gray-500">{hint}</p> : null}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentStyles[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
