"use client";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FadeIn, FadeInItem } from "@/components/ui/FadeIn";
import { FormattedTextDisplay } from "@/components/ui/FormattedTextDisplay";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Experience } from "@/types";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-spacing px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeading
            title="Experience Timeline"
            subtitle="My professional journey and key roles."
          />
        </FadeIn>

        {experiences.length > 0 ? (
          <div className="relative">
            <div
              aria-hidden
              className="absolute bottom-0 left-3 top-0 w-0.5 bg-gradient-to-b from-theme-light via-theme to-purple-500 sm:left-4 md:left-1/2 md:-translate-x-1/2"
            />

            <div className="space-y-8 sm:space-y-10">
              {experiences.map((experience, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <FadeInItem
                    key={experience.id}
                    index={index}
                    className="relative md:grid md:grid-cols-2 md:gap-8"
                  >
                    <div
                      className={
                        isLeft
                          ? "md:col-start-1 md:row-start-1 md:text-right"
                          : "md:col-start-2 md:row-start-1"
                      }
                    >
                      <article className="glassmorphism lofi-card ml-8 p-5 sm:ml-10 sm:p-6 md:ml-0">
                        <div
                          className={`mb-4 flex items-center gap-3 ${
                            isLeft ? "md:flex-row-reverse md:justify-start" : ""
                          }`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-theme/20">
                            <DynamicIcon
                              name={experience.icon}
                              className="h-5 w-5 text-theme-light"
                            />
                          </div>
                          <div className={isLeft ? "md:text-right" : ""}>
                            <h3 className="text-lg font-semibold text-white">
                              {experience.title}
                            </h3>
                            <p className="text-theme-light">{experience.company}</p>
                          </div>
                        </div>

                        <p className="mb-3 text-sm text-purple-200/80">
                          {experience.date_range}
                        </p>
                        <FormattedTextDisplay
                          stored={experience.description}
                          markdown
                          className="text-gray-300"
                          strongClassName="font-bold text-white"
                        />

                        {experience.skills.length > 0 ? (
                          <div
                            className={`mt-4 flex flex-wrap gap-2 ${
                              isLeft ? "md:justify-end" : ""
                            }`}
                          >
                            {experience.skills.map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </article>
                    </div>

                    <div
                      aria-hidden
                      className="timeline-dot absolute left-3 top-8 h-3 w-3 -translate-x-1/2 rounded-full bg-theme-light sm:left-4 md:left-1/2"
                    />
                  </FadeInItem>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Add experience entries from the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
