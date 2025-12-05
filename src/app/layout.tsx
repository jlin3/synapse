import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Understanding RAG — Synapse",
  description: "Internal reference guide on Retrieval-Augmented Generation (RAG) systems — how they work, when to use them, and the key design decisions.",
  openGraph: {
    title: "Understanding RAG — Synapse",
    description: "Search + LLM. How RAG systems ground AI responses in your own data.",
    type: "website",
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
