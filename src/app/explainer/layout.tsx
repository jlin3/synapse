import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Understanding RAG — Synapse",
  description: "A comprehensive explainer on Retrieval-Augmented Generation (RAG) systems — how they work, when to use them, and the key design decisions.",
  openGraph: {
    title: "Understanding RAG — Synapse",
    description: "Search + LLM. Learn how RAG systems ground AI responses in your own data.",
    type: "website",
  },
};

export default function ExplainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
