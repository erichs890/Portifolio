import { revalidateTag, unstable_cache } from "next/cache";
import { projectService } from "@/services/project.service";
import type { ProjectDTO } from "@/types";

const TAG = "projects";

/**
 * Published projects for the public pages. Cached so a page view does not wait on the database;
 * the admin API clears it on every create, update and delete, and it refreshes by itself every
 * five minutes for changes made outside the admin.
 *
 * Dates come back from the cache as ISO strings — always read them through `new Date(...)`.
 */
const cached = unstable_cache(async () => (await projectService.getAllProjects(1, 100)).data, ["published-projects"], {
  revalidate: 300,
  tags: [TAG],
});

/** Null when the database is unreachable (failures are never cached). */
export async function getPublishedProjects(): Promise<ProjectDTO[] | null> {
  try {
    return await cached();
  } catch {
    return null;
  }
}

export function refreshPublishedProjects() {
  revalidateTag(TAG, { expire: 0 });
}
