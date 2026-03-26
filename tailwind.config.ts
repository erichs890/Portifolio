import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#1F2937",
        navy: {
          950: "#060D1B",
          900: "#0A1628",
          800: "#0F1D32",
          700: "#162544",
        },
        accent: {
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          violet: "#8B5CF6",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "rgb(248, 250, 252)",
            a: {
              color: "#60A5FA",
              "&:hover": {
                color: "#93C5FD",
              },
            },
            strong: {
              color: "rgb(248, 250, 252)",
            },
            h1: { color: "rgb(248, 250, 252)" },
            h2: { color: "rgb(248, 250, 252)" },
            h3: { color: "rgb(248, 250, 252)" },
            h4: { color: "rgb(248, 250, 252)" },
            code: {
              color: "#FCA5A5",
            },
            blockquote: {
              color: "rgb(148, 163, 184)",
              borderLeftColor: "rgb(51, 65, 85)",
            },
            hr: {
              borderColor: "rgb(51, 65, 85)",
            },
            "ol > li::marker": {
              color: "rgb(148, 163, 184)",
            },
            "ul > li::marker": {
              color: "rgb(148, 163, 184)",
            },
            th: {
              color: "rgb(248, 250, 252)",
            },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
};
export default config;
