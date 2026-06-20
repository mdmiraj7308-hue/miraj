"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FormattedTextDisplay } from "@/components/ui/FormattedTextDisplay";
import { gradientTextClass } from "@/lib/ui/gradient-classes";
import type { BioContent } from "@/types";

type HeroSectionProps = {
  content: BioContent;
};

export function HeroSection({ content }: HeroSectionProps) {
  const roles = useMemo(
    () => (content.typed_roles.length > 0 ? content.typed_roles : ["Developer"]),
    [content.typed_roles],
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex] ?? "";
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText.length < currentRole.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length + 1));
      }, 80);
    } else if (!isDeleting && displayText.length === currentRole.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentRole.slice(0, displayText.length - 1));
      }, 40);
    } else {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((index) => (index + 1) % roles.length);
      }, 120);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <section
      id="home"
      className="section-spacing flex min-h-screen items-center justify-center px-4 pt-24 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <div className="floating profile-ring mx-auto mb-8 h-44 w-44 overflow-hidden rounded-full border-2 border-white/10 bg-black/30">
          {content.avatar_url ? (
            <Image
              src={content.avatar_url}
              alt={content.name ? `${content.name} profile photo` : "Profile photo"}
              width={176}
              height={176}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <DynamicIcon name={content.hero_icon} className="h-16 w-16 text-theme-light" />
            </div>
          )}
        </div>

        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          Hi, I&apos;m{" "}
          <span className={gradientTextClass()}>{content.name || "Your Name"}</span>
        </h1>

        <p className="mb-8 min-h-[2rem] text-xl text-gray-300 md:text-2xl">
          <span>{displayText}</span>
          <span className="typing-cursor ml-1 inline-block h-6 w-0.5 align-middle" />
        </p>

        {content.summary ? (
          <FormattedTextDisplay
            stored={content.summary}
            className="mx-auto mb-10 max-w-2xl px-2 leading-relaxed text-gray-200 md:max-w-3xl md:text-lg"
            strongClassName="font-bold text-white"
          />
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={content.cta_primary_href}
            className="rounded-lg bg-theme px-6 py-3 font-medium text-white transition hover:bg-theme-light"
          >
            {content.cta_primary_label}
          </a>
          <a
            href={content.cta_secondary_href}
            className="glassmorphism rounded-lg px-6 py-3 font-medium text-white transition hover:bg-white/10"
          >
            {content.cta_secondary_label}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
