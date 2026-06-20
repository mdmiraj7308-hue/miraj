"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/lib/admin/nav";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname.startsWith(href);
}

export function AdminSidebar({ onNavigate, className }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full w-60 flex-col bg-white", className)}>
      <div className="border-b border-gray-200 px-5 py-4">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="block text-sm font-semibold text-theme"
        >
          Portfolio Admin
        </Link>
        <p className="mt-1 text-xs text-gray-500">Content management</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminNavItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md border-l-4 px-3 py-2.5 text-sm transition",
                active
                  ? "border-theme bg-theme/10 font-medium text-theme"
                  : "border-transparent text-gray-700 hover:border-theme/30 hover:bg-gray-50 hover:text-theme",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-medium text-gray-500 hover:text-theme"
        >
          View public site →
        </Link>
      </div>
    </aside>
  );
}
