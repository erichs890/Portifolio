import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components";
import { ClientProviders } from "./components/ClientProviders";
import { HeaderWrapper } from "./components/HeaderWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Erich Lima Schlaepfer | Full Stack Developer & Data Analyst",
  description:
    "Portfolio of Erich Lima Schlaepfer — Full Stack Developer specialized in data analysis, React, Next.js and robust systems.",
  openGraph: {
    title: "Erich Lima Schlaepfer | Full Stack Developer & Data Analyst",
    description:
      "Portfolio of Erich Lima Schlaepfer — Full Stack Developer specialized in data analysis, React, Next.js and robust systems.",
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
    <html lang="en" className="dark scroll-smooth">
      <body>
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <HeaderWrapper />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0a192f",
                color: "#ccd6f6",
                border: "1px solid #1d3461",
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
