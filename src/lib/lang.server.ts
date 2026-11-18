import { cookies, headers } from "next/headers";
import type { Lang } from "@/lib/i18n";

/** The visitor's language: their saved choice first, otherwise what the browser asks for. */
export async function resolveLang(): Promise<Lang> {
  const saved = (await cookies()).get("lang")?.value;
  if (saved === "pt" || saved === "en") return saved;
  const preferred = (await headers()).get("accept-language") ?? "";
  return preferred.trim().toLowerCase().startsWith("pt") ? "pt" : "en";
}
