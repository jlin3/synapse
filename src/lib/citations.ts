interface Paper {
  title: string;
  authors: string[];
  publicationDate: string;
  doi: string | null;
  journal: string | null;
}

/**
 * Generate a BibTeX citation for a paper
 */
export function generateBibTeX(paper: Paper): string {
  const year = new Date(paper.publicationDate).getFullYear();
  
  // Create a citation key from first author's last name and year
  const firstAuthor = paper.authors[0] || "Unknown";
  const lastName = firstAuthor.split(" ").pop() || "Unknown";
  const citeKey = `${lastName}${year}`.replace(/[^a-zA-Z0-9]/g, "");
  
  // Format authors for BibTeX (Last, First and Last, First)
  const bibtexAuthors = paper.authors
    .map((author) => {
      const parts = author.trim().split(" ");
      if (parts.length === 1) return parts[0];
      const lastName = parts.pop();
      const firstName = parts.join(" ");
      return `${lastName}, ${firstName}`;
    })
    .join(" and ");

  const lines = [
    `@article{${citeKey},`,
    `  title = {${escapeLatex(paper.title)}},`,
    `  author = {${escapeLatex(bibtexAuthors)}},`,
  ];

  if (paper.journal) {
    lines.push(`  journal = {${escapeLatex(paper.journal)}},`);
  }

  lines.push(`  year = {${year}},`);

  if (paper.doi) {
    const cleanDoi = paper.doi.replace("https://doi.org/", "");
    lines.push(`  doi = {${cleanDoi}},`);
    lines.push(`  url = {https://doi.org/${cleanDoi}},`);
  }

  lines.push(`}`);

  return lines.join("\n");
}

/**
 * Generate an APA 7th edition citation for a paper
 */
export function generateAPA(paper: Paper): string {
  const year = new Date(paper.publicationDate).getFullYear();

  // Format authors for APA
  // APA format: Last, F. M., & Last, F. M.
  const apaAuthors = formatAPAAuthors(paper.authors);

  // Build the citation
  let citation = `${apaAuthors} (${year}). ${paper.title}`;

  // Add period after title if not already there
  if (!citation.endsWith(".")) {
    citation += ".";
  }

  // Add journal in italics (represented with asterisks for plain text)
  if (paper.journal) {
    citation += ` *${paper.journal}*.`;
  }

  // Add DOI
  if (paper.doi) {
    const cleanDoi = paper.doi.replace("https://doi.org/", "");
    citation += ` https://doi.org/${cleanDoi}`;
  }

  return citation;
}

/**
 * Format authors in APA style
 * - Up to 20 authors: list all
 * - More than 20: first 19 ... last author
 */
function formatAPAAuthors(authors: string[]): string {
  if (authors.length === 0) return "Unknown Author";

  const formatSingleAuthor = (author: string): string => {
    const parts = author.trim().split(" ");
    if (parts.length === 1) return parts[0];
    
    const lastName = parts.pop() || "";
    const initials = parts
      .map((name) => name.charAt(0).toUpperCase() + ".")
      .join(" ");
    
    return `${lastName}, ${initials}`;
  };

  if (authors.length === 1) {
    return formatSingleAuthor(authors[0]);
  }

  if (authors.length === 2) {
    return `${formatSingleAuthor(authors[0])} & ${formatSingleAuthor(authors[1])}`;
  }

  if (authors.length <= 20) {
    const allButLast = authors
      .slice(0, -1)
      .map(formatSingleAuthor)
      .join(", ");
    const last = formatSingleAuthor(authors[authors.length - 1]);
    return `${allButLast}, & ${last}`;
  }

  // More than 20 authors
  const first19 = authors
    .slice(0, 19)
    .map(formatSingleAuthor)
    .join(", ");
  const last = formatSingleAuthor(authors[authors.length - 1]);
  return `${first19}, ... ${last}`;
}

/**
 * Escape special LaTeX characters for BibTeX
 */
function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/**
 * Copy text to clipboard and return success status
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
