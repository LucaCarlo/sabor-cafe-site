import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 44,
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
