"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientTextClass } from "@/lib/ui/gradient-classes";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

type NavbarProps = {
  name: string;
};

export function Navbar({ name }: NavbarProps) {
  const [activeHref, setActiveHref] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glassmorphism mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a
          href="#home"
          className={gradientTextClass("text-lg font-semibold transition hover:opacity-90")}
        >
          {name || "Portfolio"}
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  activeHref === link.href
                    ? "bg-theme/20 text-theme-light"
                    : "text-gray-300 hover:text-white",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-md p-2 text-gray-300 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen ? (
        <div className="glassmorphism mx-auto mt-2 max-w-6xl px-4 py-3 lg:hidden">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition",
                    activeHref === link.href
                      ? "bg-theme/20 text-theme-light"
                      : "text-gray-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
