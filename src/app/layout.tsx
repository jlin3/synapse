import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://synapster.vercel.app";

export const metadata: Metadata = {
  title: "Synapster — AI-Powered Cardiology Research Discovery",
  description: "Discover the latest cardiology research papers with AI-generated summaries, ELI5 explanations, and key highlights. Stay updated with real-time social discussions from X/Twitter.",
  keywords: ["cardiology", "research papers", "AI", "medical research", "heart disease", "cardiovascular", "science", "academic papers"],
  authors: [{ name: "Synapse" }],
  creator: "Synapse",
  publisher: "Synapse",
  metadataBase: new URL(siteUrl),
  
  // Apple-specific
  appleWebApp: {
    capable: true,
    title: "Synapster",
    statusBarStyle: "black-translucent",
  },
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Synapster",
    title: "Synapster — AI-Powered Cardiology Research Discovery",
    description: "Discover cardiology research papers with AI summaries, ELI5 explanations & key highlights. Plus real-time social discussions.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Synapster - AI-Powered Cardiology Research Discovery",
        type: "image/png",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Synapster — AI-Powered Cardiology Research",
    description: "Discover cardiology papers with AI summaries, ELI5 explanations & key highlights.",
    creator: "@synapse",
    images: [`${siteUrl}/opengraph-image`],
  },
  
  other: {
    // Additional meta for iMessage/Apple
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Synapster",
  },
  
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Explicit OG image for better iMessage support */}
        <meta property="og:image" content={`${siteUrl}/opengraph-image`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/opengraph-image`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        
        {/* Preload the OG image */}
        <link rel="preload" href={`${siteUrl}/opengraph-image`} as="image" type="image/png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
