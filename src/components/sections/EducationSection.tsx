import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FadeIn, FadeInItem } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Education } from "@/types";

type EducationSectionProps = {
  education: Education[];
};

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="section-spacing px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <SectionHeading title="Education" />
        </FadeIn>

        {education.length > 0 ? (
          <div className="space-y-6">
            {education.map((entry, index) => (
              <FadeInItem key={entry.id} index={index}>
                <article className="glassmorphism lofi-card mx-auto max-w-2xl p-6 text-center sm:p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-theme/20">
                    <DynamicIcon
                      name={entry.icon}
                      className="h-8 w-8 text-theme-light"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{entry.degree}</h3>
                  <p className="mt-2 text-theme-light">{entry.institution}</p>
                  <p className="mt-2 text-sm text-gray-400">{entry.date_range}</p>
                </article>
              </FadeInItem>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Add education entries from the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
