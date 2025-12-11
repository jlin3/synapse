import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Synapse - Follow Any Research";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)",
        }}
      >
        {/* Logo and brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
          {/* Synapse logo - neural network style */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#0a0a0a",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.03em",
            }}
          >
            Synapse
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "40px",
            fontWeight: 600,
            marginBottom: "24px",
            color: "white",
          }}
        >
          Follow Any Research
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: "800px",
            marginBottom: "48px",
          }}
        >
          Type it. Synapse builds your daily feed of papers.
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["AI Summaries", "ELI5 Mode", "Social Feed"].map((feature) => (
            <div
              key={feature}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                border: "1px solid rgba(168, 85, 247, 0.3)",
                borderRadius: "24px",
                padding: "12px 24px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                }}
              />
              <span style={{ color: "#e4e4e7", fontSize: "18px", fontWeight: 500 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            fontSize: "18px",
            color: "#52525b",
          }}
        >
          synapsesocial.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
