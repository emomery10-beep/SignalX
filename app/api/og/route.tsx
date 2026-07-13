import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { markTileSVG, toDataUri } from "@/lib/brand";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // mode=brand renders the sitewide share card (served at /og-image.png via a
  // next.config rewrite) — same visual system, homepage message instead of
  // Academy framing.
  const brand = searchParams.get("mode") === "brand";
  const title = searchParams.get("title") ?? (brand ? "Sell with your phone. See what you made tonight." : "AskBiz Academy");
  const category = searchParams.get("category") ?? (brand ? "Phone POS · M-Pesa · Daily profit" : "Business Intelligence");
  const difficulty = searchParams.get("difficulty") ?? "";
  const readTime = searchParams.get("readTime") ?? "";
  const pill = brand ? "AskBiz" : "AskBiz Academy";
  const footer = brand ? "askbiz.co" : "askbiz.co/academy";

  // Truncate long titles for layout safety
  const displayTitle = title.length > 70 ? title.slice(0, 67) + "…" : title;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#1a1a2e",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "#C97A44",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            height: "100%",
          }}
        >
          {/* Top: brand + category */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img width="72" height="72" src={toDataUri(markTileSVG(72))} alt="AskBiz" />
            <div
              style={{
                background: "#C97A44",
                color: "#fff",
                fontSize: "12px",
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: "20px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {pill}
            </div>
            <div
              style={{
                color: "#b0b8c8",
                fontSize: "12px",
                padding: "6px 16px",
                borderRadius: "20px",
                border: "1px solid #2d3a50",
              }}
            >
              {category}
            </div>
          </div>

          {/* Middle: title */}
          <div
            style={{
              color: "#ffffff",
              fontSize: displayTitle.length > 50 ? "44px" : "52px",
              fontWeight: 700,
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {displayTitle}
          </div>

          {/* Bottom: meta */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ color: "#b0b8c8", fontSize: "14px" }}>{footer}</div>
            {difficulty && (
              <div
                style={{
                  color: "#C97A44",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 12px",
                  borderRadius: "12px",
                  border: "1px solid #C97A44",
                }}
              >
                {difficulty}
              </div>
            )}
            {readTime && (
              <div style={{ color: "#b0b8c8", fontSize: "12px" }}>{`${readTime} min read`}</div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
