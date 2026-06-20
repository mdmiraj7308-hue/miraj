"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/actions/contact";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gradientTextClass } from "@/lib/ui/gradient-classes";
import type { ActionState } from "@/lib/admin/action-utils";
import type { ContactContent } from "@/types";

type ContactSectionProps = {
  content: ContactContent;
};

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-theme-light focus:ring-1 focus:ring-theme-light";

export function ContactSection({ content }: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState<
    ActionState | null,
    FormData
  >(submitContactMessage, null);

  return (
    <section id="contact" className="section-spacing px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <SectionHeading title={content.title} />
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn delay={0.05} className="glassmorphism p-6 sm:p-8">
            <h3 className={gradientTextClass("mb-6 text-lg font-semibold")}>
              {content.form_title}
            </h3>

            <form action={formAction} className="space-y-4">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-gray-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className={inputClassName}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={inputClassName}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className={`${inputClassName} resize-y`}
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {state?.error ? (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                  {state.error}
                </p>
              ) : null}
              {state?.success ? (
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                  {state.success}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-theme py-3 font-medium text-white transition hover:bg-theme-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.1} className="glassmorphism p-6 sm:p-8">
            <h3 className={gradientTextClass("mb-6 text-lg font-semibold")}>
              {content.connect_title}
            </h3>

            {content.social_links.length > 0 ? (
              <ul className="space-y-3">
                {content.social_links.map((link) => (
                  <li key={`${link.name}-${link.url}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-theme px-4 py-3 text-center font-medium text-white transition hover:bg-theme-light"
                    >
                      <DynamicIcon name={link.icon} className="h-5 w-5 shrink-0" />
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">
                Add message links from the admin contact settings.
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
