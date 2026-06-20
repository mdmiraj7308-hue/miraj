import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PublicPageShell } from "@/components/layout/PublicPageShell";
import { getPortfolioData } from "@/lib/public/portfolio";
import { stripFormattingMarkup } from "@/lib/admin/formatted-text";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { bio } = await getPortfolioData();

  return {
    title: bio.name ? `${bio.name} | Portfolio` : "Portfolio",
    description: stripFormattingMarkup(bio.summary) || "Personal portfolio website",
  };
}

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <PublicPageShell>
      <Navbar name={data.bio.name} />
      <main>
        <HeroSection content={data.bio} />
        <AboutSection content={data.about} />
        <SkillsSection skills={data.skills} />
        <ProjectsSection projects={data.projects} />
        <ExperienceSection experiences={data.experiences} />
        <EducationSection education={data.education} />
        <ContactSection content={data.contact} />
      </main>
      <Footer name={data.bio.name} />
      <WhatsAppButton url={data.contact.whatsapp_url} />
    </PublicPageShell>
  );
}
