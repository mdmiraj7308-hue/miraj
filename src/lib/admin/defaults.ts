import type {
  AboutContent,
  BioContent,
  ContactContent,
} from "@/types";

export const defaultBioContent: BioContent = {
  name: "",
  typed_roles: [],
  summary: "",
  hero_icon: "user",
  avatar_url: null,
  cta_primary_label: "View Projects",
  cta_primary_href: "#projects",
  cta_secondary_label: "Contact Me",
  cta_secondary_href: "#contact",
};

export const defaultAboutContent: AboutContent = {
  title: "About Me",
  intro_title: "My intro",
  avatar_url: null,
  location: "",
  education: "",
  body_text: "",
};

export const defaultContactContent: ContactContent = {
  title: "Get In Touch",
  form_title: "Send a Message",
  connect_title: "Send Messages",
  notification_email: "",
  whatsapp_url: "",
  social_links: [],
};
