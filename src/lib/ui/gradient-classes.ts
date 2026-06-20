import { cn } from "@/lib/utils";

/** Teal → cyan → blue gradient matching the hero name style */
export const gradientTextClassName =
  "inline-block bg-gradient-to-r from-[#34d399] via-[#22d3ee] via-[#60a5fa] to-[#070eb0] bg-clip-text text-transparent";

export function gradientTextClass(...extra: Array<string | false | null | undefined>) {
  return cn(gradientTextClassName, ...extra);
}
