import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Header, Footer } from "@/components";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erich Lima Schlaepfer | Full Stack Developer & Data Analyst",
  description:
    "Portfólio de Erich Lima Schlaepfer — Full Stack Developer especializado em análise de dados, React, Next.js e sistemas robustos.",
  openGraph: {
    title: "Erich Lima Schlaepfer | Full Stack Developer & Data Analyst",
    description:
      "Portfólio de Erich Lima Schlaepfer — Full Stack Developer especializado em análise de dados, React, Next.js e sistemas robustos.",
    url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    siteName: "ELS Portfolio",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0F1D32',
              color: '#F8FAFC',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  );
}
