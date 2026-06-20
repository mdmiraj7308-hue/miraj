import {
  getAboutContent,
  getBioContent,
  getContactContent,
  getEducationEntries,
  getExperiences,
  getProjects,
  getSkills,
} from "@/lib/admin/queries";
import type {
  AboutContent,
  BioContent,
  ContactContent,
  Education,
  Experience,
  Project,
  Skill,
} from "@/types";

export type PortfolioData = {
  bio: BioContent;
  about: AboutContent;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  contact: ContactContent;
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const [bio, about, skills, projects, experiences, education, contact] =
    await Promise.all([
      getBioContent(),
      getAboutContent(),
      getSkills(),
      getProjects(),
      getExperiences(),
      getEducationEntries(),
      getContactContent(),
    ]);

  return {
    bio,
    about,
    skills,
    projects,
    experiences,
    education,
    contact,
  };
}
