import Image from "next/image";
import { GraduationCap, MapPin, User } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { gradientTextClass } from "@/lib/ui/gradient-classes";
import type { AboutContent } from "@/types";

type AboutIntroCardProps = {
  content: Pick<AboutContent, "intro_title" | "location" | "education" | "avatar_url">;
};

export function AboutIntroCard({ content }: AboutIntroCardProps) {
  return (
    <FadeIn
      delay={0.05}
      className="glassmorphism lofi-card flex min-h-[320px] flex-col p-8 sm:p-10"
    >
      <div className="flex flex-col items-center text-center">
        <div className="profile-ring flex h-44 w-36 items-center justify-center overflow-hidden rounded-2xl bg-black/30 sm:h-48 sm:w-40">
          {content.avatar_url ? (
            <Image
              src={content.avatar_url}
              alt={content.intro_title || "Profile"}
              width={160}
              height={192}
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-16 w-16 text-theme-light" strokeWidth={1.5} />
          )}
        </div>

        <h3 className={gradientTextClass("mt-6 text-xl font-semibold sm:text-2xl")}>
          {content.intro_title}
        </h3>
      </div>

      <div className="mt-auto flex w-full items-end justify-between gap-4 pt-8 text-sm text-gray-300 sm:text-base">
        {content.location ? (
          <div className="inline-flex max-w-[48%] items-start gap-1">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-theme-light" />
            <span className="leading-snug">{content.location}</span>
          </div>
        ) : (
          <span />
        )}

        {content.education ? (
          <div className="ml-auto inline-flex max-w-[48%] items-start gap-1">
            <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-theme-light" />
            <span className="leading-snug">{content.education}</span>
          </div>
        ) : null}
      </div>
    </FadeIn>
  );
}
