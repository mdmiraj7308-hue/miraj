import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Phone,
  FolderKanban,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, description: "Overview and quick stats" },
  { href: "/admin/bio", label: "Bio / Hero", icon: Sparkles, description: "Homepage hero content" },
  { href: "/admin/about", label: "About", icon: User, description: "About section copy" },
  { href: "/admin/skills", label: "Skills", icon: Wrench, description: "Skills and tools" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, description: "Portfolio projects" },
  { href: "/admin/experience", label: "Experience", icon: Briefcase, description: "Timeline entries" },
  { href: "/admin/education", label: "Education", icon: GraduationCap, description: "Education cards" },
  { href: "/admin/contact", label: "Contact", icon: Phone, description: "Contact settings" },
  { href: "/admin/messages", label: "Messages", icon: Mail, description: "Contact form inbox" },
];
