import { cn } from "@/lib/utils";
import {
  skillFontSizeClass,
  skillTextAlignClass,
} from "@/lib/admin/skills";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillMarkdown } from "@/components/ui/SkillMarkdown";
import { gradientTextClass } from "@/lib/ui/gradient-classes";
import type { Skill } from "@/types";

type SkillsSectionProps = {
  skills: Skill[];
};

function SkillBox({ skill }: { skill: Skill }) {
  return (
    <div className="glassmorphism w-full rounded-lg border border-white/10 px-4 py-3 text-sm leading-relaxed text-gray-200">
      <SkillMarkdown
        content={skill.text}
        className={cn(
          skillFontSizeClass(skill.font_size),
          skillTextAlignClass(skill.text_align),
        )}
        strongClassName="font-bold text-white"
      />
    </div>
  );
}

function SkillColumn({
  title,
  skills,
  emptyMessage,
}: {
  title: string;
  skills: Skill[];
  emptyMessage: string;
}) {
  return (
    <div>
      <h3 className={gradientTextClass("mb-6 text-lg font-semibold")}>{title}</h3>
      {skills.length > 0 ? (
        <div className="flex flex-col gap-3">
          {skills.map((skill) => (
            <SkillBox key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{emptyMessage}</p>
      )}
    </div>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const technical = skills.filter((skill) => skill.category === "technical");
  const tools = skills.filter((skill) => skill.category === "tool");

  return (
    <section id="skills" className="section-spacing px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <SectionHeading
            title="Skills & Tools"
            subtitle="Technologies I work with and tools I use daily."
          />
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <FadeIn delay={0.05} className="glassmorphism p-6 sm:p-8">
            <SkillColumn
              title="Technical Skills"
              skills={technical}
              emptyMessage="Add technical skills from the admin dashboard."
            />
          </FadeIn>

          <FadeIn delay={0.1} className="glassmorphism p-6 sm:p-8">
            <SkillColumn
              title="Tools & Platforms"
              skills={tools}
              emptyMessage="Add tools from the admin dashboard."
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
