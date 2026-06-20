import Link from "next/link";
import {
  Briefcase,
  Clock,
  FolderKanban,
  Mail,
  Plus,
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { getDashboardStats } from "@/lib/admin/dashboard";
import { adminNavItems } from "@/lib/admin/nav";

function formatDate(iso: string | null) {
  if (!iso) {
    return "No updates yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const quickActions = [
  { href: "/admin/projects", label: "Add a project", icon: Plus },
  { href: "/admin/messages", label: "View messages", icon: Mail },
  { href: "/admin/bio", label: "Edit hero bio", icon: FolderKanban },
  { href: "/admin/experience", label: "Update experience", icon: Briefcase },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const contentLinks = adminNavItems.filter((item) => item.href !== "/admin");

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your portfolio content and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Projects"
          value={stats.projectCount}
          hint="Published on your homepage"
          icon={FolderKanban}
        />
        <StatCard
          label="Experience entries"
          value={stats.experienceCount}
          hint="Timeline items"
          icon={Briefcase}
          accent="success"
        />
        <StatCard
          label="Unread messages"
          value={stats.unreadMessages}
          hint={`${stats.totalMessages} total received`}
          icon={Mail}
          accent={stats.unreadMessages > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Last updated"
          value={stats.lastUpdated ? "Recent" : "—"}
          hint={formatDate(stats.lastUpdated)}
          icon={Clock}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quick Actions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-md border border-gray-200 px-4 py-3 text-sm text-gray-700 transition hover:border-theme/40 hover:bg-theme/5 hover:text-theme"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Manage Content
          </h3>
          <ul className="divide-y divide-gray-100">
            {contentLinks.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 py-3 text-sm text-gray-700 transition hover:text-theme"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.description ? (
                        <p className="text-xs text-gray-500">{item.description}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Getting Started
        </h3>
        <p className="text-sm text-gray-600">
          Use the sidebar to edit each section of your public portfolio. Changes
          you save here will appear on the homepage after the next publish step.
          Start with <Link href="/admin/bio" className="font-medium text-theme hover:underline">Bio / Hero</Link>, then add your{" "}
          <Link href="/admin/projects" className="font-medium text-theme hover:underline">Projects</Link>.
        </p>
      </section>
    </div>
  );
}
