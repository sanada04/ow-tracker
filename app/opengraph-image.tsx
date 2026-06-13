import { ImageResponse } from "next/og";

export const alt = "OW Tracker — Overwatch 2 Stats Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a12",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* orange top-left glow */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(244,160,41,0.18) 0%, transparent 70%)",
          }}
        />
        {/* cyan bottom-right glow */}
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -150,
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(26,191,229,0.08) 0%, transparent 70%)",
          }}
        />
        {/* orange accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, transparent, #f4a029 30%, #f4a029 70%, transparent)",
          }}
        />

        {/* content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 48, height: 1, background: "rgba(244,160,41,0.5)" }} />
            <span
              style={{
                fontSize: 18,
                letterSpacing: "0.3em",
                color: "rgba(244,160,41,0.8)",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              OVERWATCH 2 STATS TRACKER
            </span>
            <div style={{ width: 48, height: 1, background: "rgba(244,160,41,0.5)" }} />
          </div>

          {/* main title */}
          <div style={{ display: "flex", fontSize: 110, fontWeight: 700, lineHeight: 1 }}>
            <span style={{ color: "white" }}>OW</span>
            <span style={{ color: "#f4a029" }}>&nbsp;TRACKER</span>
          </div>

          {/* subtitle */}
          <div
            style={{
              fontSize: 26,
              color: "rgba(232,232,240,0.45)",
              marginTop: 4,
            }}
          >
            ランク・スタッツ・ヒーロー統計を確認
          </div>
        </div>

        {/* bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(244,160,41,0.3) 50%, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
