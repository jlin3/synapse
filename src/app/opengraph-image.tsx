import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Synapster - AI-Powered Cardiology Research Discovery";
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #18181b 50%, #0a0a0a 100%)",
          position: "relative",
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "200px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 32 32"
              fill="none"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle cx="16" cy="16" r="3" fill="url(#grad1)" />
              <circle cx="16" cy="4" r="2.5" fill="url(#grad1)" />
              <circle cx="16" cy="28" r="2.5" fill="url(#grad1)" />
              <circle cx="4" cy="16" r="2.5" fill="url(#grad1)" />
              <circle cx="28" cy="16" r="2.5" fill="url(#grad1)" />
              <circle cx="7" cy="7" r="2" fill="url(#grad1)" />
              <circle cx="25" cy="7" r="2" fill="url(#grad1)" />
              <circle cx="7" cy="25" r="2" fill="url(#grad1)" />
              <circle cx="25" cy="25" r="2" fill="url(#grad1)" />
              <line x1="16" y1="13" x2="16" y2="6.5" stroke="url(#grad1)" strokeWidth="1.5" />
              <line x1="16" y1="19" x2="16" y2="25.5" stroke="url(#grad1)" strokeWidth="1.5" />
              <line x1="13" y1="16" x2="6.5" y2="16" stroke="url(#grad1)" strokeWidth="1.5" />
              <line x1="19" y1="16" x2="25.5" y2="16" stroke="url(#grad1)" strokeWidth="1.5" />
            </svg>
            <span
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              Synapster
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "white",
                background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                padding: "4px 12px",
                borderRadius: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Beta
            </span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            <span style={{ color: "#a855f7" }}>AI-Powered</span>
            <span style={{ color: "white", marginLeft: "12px" }}>Cardiology Research Discovery</span>
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.5,
            }}
          >
            Research papers with AI summaries, ELI5 explanations & real-time social discussions
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "40px",
            }}
          >
            {["AI Insights", "ELI5 Mode", "Social Feed", "Bookmarks"].map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  }}
                />
                <span style={{ color: "#e4e4e7", fontSize: "16px" }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
