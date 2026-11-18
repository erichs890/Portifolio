"use client";

import { ReactNode } from "react";
import { I18nProvider, type Lang } from "@/lib/i18n";

export function ClientProviders({ children, initialLang }: { children: ReactNode; initialLang: Lang }) {
  return <I18nProvider initialLang={initialLang}>{children}</I18nProvider>;
}
