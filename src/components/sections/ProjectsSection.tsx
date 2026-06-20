"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Code2, ExternalLink } from "lucide-react";
import { FadeInItem } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  FormattedTextDisplay,
  getPlainFormattedPreview,
} from "@/components/ui/FormattedTextDisplay";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { SkillMarkdown } from "@/components/ui/SkillMarkdown";
import { parseFormattedStorage } from "@/lib/admin/formatted-text";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const PAGE_SIZE = 4;
const PREVIEW_LENGTH = 120;

type ProjectCardProps = {
  project: Project;
  expanded: boolean;
  index: number;
  onToggle: () => void;
};

function ProjectCard({ project, expanded, index, onToggle }: ProjectCardProps) {
  const techStackDisplay = project.tech_stack_text.trim()
    ? project.tech_stack_text
    : project.tech_stack.join(", ");

  return (
    <FadeInItem index={index}>
      <motion.article
        layout
        className={cn(
          "glassmorphism lofi-card cursor-pointer overflow-hidden transition-shadow",
          expanded && "ring-1 ring-theme/40",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full flex-col items-center p-6 text-left"
          aria-expanded={expanded}
        >
          <div className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-theme/20">
            {project.image_url ? (
              <Image
                src={project.image_url}
                alt={getPlainFormattedPreview(project.title, 80)}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <DynamicIcon
                name={project.icon}
                className="h-8 w-8 text-theme-light"
              />
            )}
          </div>

          <FormattedTextDisplay
            stored={project.title}
            className="mb-2 font-semibold text-white"
            strongClassName="font-bold text-white"
          />

          {!expanded ? (
            <p className="text-center text-sm text-gray-400">
              {getPlainFormattedPreview(project.description, PREVIEW_LENGTH)}
            </p>
          ) : null}

          <ChevronDown
            className={cn(
              "mt-4 h-5 w-5 text-gray-400 transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 px-6 pb-6 pt-2">
                <FormattedTextDisplay
                  stored={project.description}
                  markdown
                  className="mb-4 text-gray-300"
                  strongClassName="font-bold text-white"
                />

                {techStackDisplay ? (
                  <div className="mb-4 flex flex-wrap justify-center gap-2">
                    {project.tech_stack_text.trim()
                      ? parseFormattedStorage(project.tech_stack_text)
                          .text.split(",")
                          .map((tech) => tech.trim())
                          .filter(Boolean)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full bg-theme/20 px-3 py-1 text-xs text-theme-light"
                            >
                              <SkillMarkdown
                                content={tech}
                                strongClassName="font-bold text-theme-light"
                              />
                            </span>
                          ))
                      : project.tech_stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full bg-theme/20 px-3 py-1 text-xs text-theme-light"
                          >
                            {tech}
                          </span>
                        ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap justify-center gap-3">
                  {project.live_link ? (
                    <a
                      href={project.live_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-theme px-4 py-2 text-sm text-white transition hover:bg-theme-light"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  ) : null}
                  {project.github_link ? (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-200 transition hover:bg-white/5"
                    >
                      <Code2 className="h-4 w-4" />
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </FadeInItem>
  );
}

type ProjectsSectionProps = {
  projects: Project[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  return (
    <section id="projects" className="section-spacing px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title="Projects"
          subtitle="Selected work and builds. Click a card to expand details."
        />

        {projects.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  expanded={expandedId === project.id}
                  onToggle={() =>
                    setExpandedId((current) =>
                      current === project.id ? null : project.id,
                    )
                  }
                />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  className="glassmorphism rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  See More
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-center text-gray-400">
            Add projects from the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
