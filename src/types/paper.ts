export interface Concept {
  id: string;
  name: string;
  score: number;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
  concepts?: Concept[];
  pdfUrl?: string | null;
  githubUrl?: string | null;
  arxivId?: string | null;
  isOpenAccess?: boolean;
  trendScore?: number;
}

export interface PaperMetadata {
  studyType: string;
  rigorLevel: "high" | "medium" | "low";
  claimType: "novel" | "replication" | "review" | "meta-analysis" | "unknown";
  badges: string[];
}

export interface PaperInsights {
  synthesis: string;
  eli5: string;
  highlights: string[];
}

export interface RelatedPaper {
  id: string;
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  abstract: string | null;
  citedByCount: number;
  journal: string | null;
}
