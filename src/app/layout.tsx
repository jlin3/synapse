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
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Synapster",
    title: "Synapster — AI-Powered Cardiology Research Discovery",
    description: "Discover cardiology research papers with AI summaries, ELI5 explanations & key highlights. Plus real-time social discussions.",
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Synapster — AI-Powered Cardiology Research",
    description: "Discover cardiology papers with AI summaries, ELI5 explanations & key highlights.",
    creator: "@synapse",
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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
