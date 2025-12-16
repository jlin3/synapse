export function extractIdentifierTokens(query: string): string[] {
  const q = query.trim();
  if (!q) return [];

  const rawTokens = q.split(/\s+/);
  const cleaned = rawTokens
    .map((t) => t.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ""))
    .filter(Boolean);

  // Heuristic: "identifier-like" tokens usually include both letters and digits
  // and are short-ish (e.g., BPC-157, BRCA1, rs12345, IL6).
  return cleaned.filter((t) => {
    if (t.length < 3 || t.length > 40) return false;
    const hasLetter = /[A-Za-z]/.test(t);
    const hasDigit = /\d/.test(t);
    return hasLetter && hasDigit;
  });
}

export function isIdentifierLikeQuery(query: string): boolean {
  const tokens = extractIdentifierTokens(query);
  if (tokens.length === 0) return false;

  // If the query is primarily an identifier (short, no sentence punctuation),
  // treat it as identifier-like and prioritize exact token matching.
  const q = query.trim();
  if (q.length <= 40) return true;

  // Longer queries: still identifier-like if the identifier is very prominent.
  // (e.g., "BPC-157 risks in humans")
  return tokens.some((t) => t.length >= 5);
}

/**
 * Normalize a user query for consistent caching and request de-duplication.
 * - Trims ends
 * - Collapses internal whitespace to single spaces
 * - Lowercases for cache keys (search backends are typically case-insensitive)
 */
export function normalizeQueryForCache(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Normalize a user query for sending to search backends (preserves case).
 */
export function normalizeQueryForSearch(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}


