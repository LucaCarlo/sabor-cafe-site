import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1410",
          color: "#C9A36F",
          fontSize: 124,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: 400,
          letterSpacing: "-0.02em",
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
