export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  tech_stack_text: string;
  icon: string;
  live_link: string | null;
  github_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  date_range: string;
  description: string;
  skills: string[];
  icon: string;
  sort_order: number;
  created_at: string;
};

export type SkillFontSize = "sm" | "base" | "lg" | "xl";
export type SkillTextAlign = "left" | "center" | "right";
export type SkillCategory = "technical" | "tool";

export type Skill = {
  id: string;
  text: string;
  category: SkillCategory;
  font_size: SkillFontSize;
  text_align: SkillTextAlign;
  sort_order: number;
};

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  sort_order: number;
};

export type Education = {
  id: string;
  degree: string;
  institution: string;
  date_range: string;
  icon: string;
  sort_order: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  read: boolean;
};

export type SiteContentKey = "bio" | "about" | "contact";

export type BioContent = {
  name: string;
  typed_roles: string[];
  summary: string;
  hero_icon: string;
  avatar_url: string | null;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

export type AboutContent = {
  title: string;
  intro_title: string;
  avatar_url: string | null;
  location: string;
  education: string;
  body_text: string;
};

export type SocialLink = {
  name: string;
  url: string;
  icon: string;
};

export type ContactContent = {
  title: string;
  form_title: string;
  connect_title: string;
  notification_email: string;
  whatsapp_url: string;
  social_links: SocialLink[];
};

export type SiteContent = {
  id: string;
  key: SiteContentKey;
  content: BioContent | AboutContent | ContactContent;
  updated_at: string;
};
