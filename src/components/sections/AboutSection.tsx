import { FadeIn } from "@/components/ui/FadeIn";
import { FormattedTextDisplay } from "@/components/ui/FormattedTextDisplay";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AboutIntroCard } from "@/components/sections/AboutIntroCard";
import type { AboutContent } from "@/types";

type AboutSectionProps = {
  content: AboutContent;
};

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="about-section relative section-spacing px-4 sm:px-6">
      <div aria-hidden className="about-sunset-bg pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <FadeIn>
          <SectionHeading title={content.title} />
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
          <AboutIntroCard content={content} />

          <FadeIn
            delay={0.08}
            className="glassmorphism lofi-card min-h-[320px] p-6 sm:p-8"
          >
            {content.body_text ? (
              <FormattedTextDisplay
                stored={content.body_text}
                markdown
                className="text-left text-gray-300"
                strongClassName="font-bold text-white"
              />
            ) : (
              <p className="text-left text-gray-400">
                Add your story from the admin dashboard.
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
