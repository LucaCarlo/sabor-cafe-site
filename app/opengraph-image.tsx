import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sabor Cafè — Civitanova Marche";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background:
            "linear-gradient(135deg, #1A1410 0%, #2A1F16 60%, #3A2A1C 100%)",
          color: "#FAF6EC",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#C9A36F",
          }}
        >
          <span>Sabor Cafè</span>
          <span>EST · Civitanova</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 128,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            Caffè, cucina,
            <br />
            <span style={{ color: "#C9A36F", fontStyle: "italic" }}>
              aperitivo curato.
            </span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#E5D2AE",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Bar contemporaneo a Civitanova Marche.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#9C7A4B",
            borderTop: "1px solid #6E5530",
            paddingTop: 28,
          }}
        >
          <span>saborcafe.it</span>
          <span>@sabor.cafe</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
