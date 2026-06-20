"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LogoutButton } from "@/components/admin/LogoutButton";

type AdminShellProps = {
  children: React.ReactNode;
  userEmail?: string | null;
};

export function AdminShell({ children, userEmail }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-gray-900">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen">
        <div
          className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 lg:static lg:z-auto lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 lg:hidden">
            <span className="text-sm font-semibold text-theme">Menu</span>
            <button
              type="button"
              aria-label="Close sidebar"
              className="rounded-md p-1 text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <AdminSidebar
            onNavigate={() => setMobileOpen(false)}
            className="h-full min-h-screen lg:min-h-0"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                className="rounded-md border border-gray-200 p-2 text-gray-700 hover:bg-gray-50 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Portfolio CMS
                </p>
                <h1 className="text-base font-semibold sm:text-lg">
                  Admin Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden text-sm text-gray-600 hover:text-theme sm:inline"
              >
                View Site
              </a>
              {userEmail ? (
                <span className="hidden max-w-[180px] truncate text-sm text-gray-500 md:inline">
                  {userEmail}
                </span>
              ) : null}
              <LogoutButton />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
