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
        primary: "#64ffda",
        secondary: "#0a192f",
        navy: {
          950: "#020c1b",
          900: "#0a192f",
          800: "#112240",
          700: "#1d3461",
        },
        accent: {
          cyan: "#64ffda",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          slate: "#8892b0",
        },
        text: {
          primary: "#ccd6f6",
          secondary: "#8892b0",
          heading: "#e6f1ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#ccd6f6",
            a: {
              color: "#64ffda",
              "&:hover": {
                color: "#64ffda",
                opacity: 0.8,
              },
            },
            strong: { color: "#e6f1ff" },
            h1: { color: "#e6f1ff" },
            h2: { color: "#e6f1ff" },
            h3: { color: "#e6f1ff" },
            h4: { color: "#e6f1ff" },
            code: { color: "#64ffda" },
            blockquote: {
              color: "#8892b0",
              borderLeftColor: "#1d3461",
            },
            hr: { borderColor: "#1d3461" },
            "ol > li::marker": { color: "#8892b0" },
            "ul > li::marker": { color: "#8892b0" },
            th: { color: "#e6f1ff" },
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
};
export default config;
