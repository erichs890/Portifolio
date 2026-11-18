import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };

interface OgCardProps {
  /** Mono line above the title, written like a terminal prompt. */
  prompt: string;
  title: string;
  subtitle: string;
  tags?: string[];
}

/** Shared social card: dark surface, violet accent, the same voice as the site's terminal. */
export function ogCard({ prompt, title, subtitle, tags = [] }: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0A0D14",
          color: "#F2F4F8",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#8D96A8" }}>
          <span style={{ color: "#A99BFF", marginRight: 14 }}>portfolio_db=&gt;</span>
          {prompt}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: title.length > 28 ? 68 : 88, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, lineHeight: 1.35, color: "#C5CBD8", maxWidth: 980 }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex" }}>
            {tags.slice(0, 5).map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  marginRight: 12,
                  padding: "8px 16px",
                  border: "1px solid #2A3142",
                  borderRadius: 8,
                  background: "#171C28",
                  fontSize: 22,
                  color: "#C5CBD8",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#F2F4F8" }}>
            {"<"}
            <span style={{ color: "#A99BFF" }}>Erich</span>
            {" />"}
            <span style={{ marginLeft: 16, color: "#8D96A8" }}>{SITE.name}</span>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
