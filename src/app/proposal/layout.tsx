import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synapse Personalized Feed v1 — Budget & Architecture Proposal",
  description: "Personalized research feed system for Synapse: RAG + recommender architecture powering oncology-first discovery with community signal integration.",
  openGraph: {
    title: "Synapse Personalized Feed v1 — Budget & Architecture Proposal",
    description: "RAG + Recommender system • Phase I ~$93k • Phase II $565k+/year",
    type: "website",
  },
};

export default function ProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

