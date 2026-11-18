import { OG_SIZE, ogCard } from "@/lib/ogImage";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogCard({
    prompt: "SELECT * FROM projects;",
    title: SITE.name,
    subtitle: SITE.role,
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Python"],
  });
}
