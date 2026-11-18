import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components";
import { resolveLang } from "@/lib/lang.server";
import { jsonLdScript, personJsonLd, SITE_COPY, siteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { ClientProviders } from "./components/ClientProviders";
import { HeaderWrapper } from "./components/HeaderWrapper";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await resolveLang();
  const copy = SITE_COPY[lang];
  return {
    metadataBase: new URL(siteUrl()),
    title: copy.title,
    description: copy.description,
    alternates: { canonical: "/" },
    authors: [{ name: SITE.name, url: SITE.linkedin }],
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: "/",
      siteName: SITE.name,
      locale: lang === "pt" ? "pt_BR" : "en_US",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.description },
    icons: { icon: "/favicon.ico" },
  };
}

export const viewport: Viewport = {
  themeColor: [{ color: "#0a0d14" }],
  colorScheme: "dark light",
};

/* Applies a saved theme before first paint; with nothing saved, the site stays dark. */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await resolveLang();

  return (
    <html
      lang={lang === "pt" ? "pt-BR" : "en"}
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(personJsonLd()) }} />
      </head>
      <body>
        <ClientProviders initialLang={lang}>
          <div className="flex flex-col min-h-screen">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-3 focus:rounded-[10px] focus:bg-accent focus:text-on-accent focus:font-semibold"
            >
              {lang === "pt" ? "Pular para o conteúdo" : "Skip to content"}
            </a>
            <HeaderWrapper />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--surface-2)",
                color: "var(--heading)",
                border: "1px solid var(--line)",
                borderRadius: "12px",
                fontSize: "14px",
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
