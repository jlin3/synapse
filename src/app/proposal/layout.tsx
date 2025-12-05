import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Synapse RAG System v1 — Budget & Architecture Proposal",
  description: "MVP Recommender proposal for Synapse: 3-4 month oncology-first personalized research recommender with three implementation options and detailed cost analysis.",
  openGraph: {
    title: "Synapse RAG System v1 — Budget & Architecture Proposal",
    description: "MVP build budget $6k-$15k • Run rate $800-$2k/mo • 3-4 month timeline",
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

