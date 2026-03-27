import about from "@/content/about.json";
import hobbies from "@/content/hobbies.json";
import social from "@/content/social.json";
import projects from "@/content/projects.json";

export const siteContent = {
  about,
  hobbies,
  social,
  projects,
};

export type Project = (typeof projects)[number];
export type SocialItem = (typeof social)["items"][number];
export type HobbyItem = (typeof hobbies)["items"][number];

