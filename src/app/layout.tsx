import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://synapster.vercel.app";

export const metadata: Metadata = {
  title: "Synapse — Follow Any Research",
  description:
    "Type it. Synapse builds your daily feed of papers. Discover research with AI summaries, ELI5 explanations, and real-time social discussions.",
  keywords: [
    "research papers",
    "AI",
    "medical research",
    "cardiology",
    "science",
    "academic papers",
    "paper discovery",
  ],
  authors: [{ name: "Synapse" }],
  creator: "Synapse",
  publisher: "Synapse",
  metadataBase: new URL(siteUrl),

  // Apple-specific
  appleWebApp: {
    capable: true,
    title: "Synapse",
    statusBarStyle: "black-translucent",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Synapse",
    title: "Synapse — Follow Any Research",
    description:
      "Type it. Synapse builds your daily feed of papers with AI summaries & social discussions.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Synapse - Follow Any Research",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Synapse — Follow Any Research",
    description:
      "Type it. Synapse builds your daily feed of papers with AI summaries & social discussions.",
    creator: "@synaboratory",
    images: [`${siteUrl}/opengraph-image`],
  },

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Synapse",
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
        <meta property="og:image" content={`${siteUrl}/opengraph-image`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/opengraph-image`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <link rel="preload" href={`${siteUrl}/opengraph-image`} as="image" type="image/png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
