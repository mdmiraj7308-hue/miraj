import {
  Award,
  Bot,
  Brain,
  Briefcase,
  Circle,
  Code2,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Rocket,
  Sparkles,
  TrendingUp,
  User,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  bot: Bot,
  brain: Brain,
  briefcase: Briefcase,
  circle: Circle,
  code: Code2,
  "code-2": Code2,
  "external-link": ExternalLink,
  "folder-kanban": FolderKanban,
  github: Code2,
  "graduation-cap": GraduationCap,
  link: Link2,
  mail: Mail,
  "map-pin": MapPin,
  rocket: Rocket,
  sparkles: Sparkles,
  "trending-up": TrendingUp,
  user: User,
};

type DynamicIconProps = LucideProps & {
  name: string;
};

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const normalized = name.trim().toLowerCase();
  const Icon = iconMap[normalized] ?? Circle;
  return <Icon {...props} />;
}
