import { NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY;

// Cache duration: 24 hours (in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// CDN cache: 24h fresh, 7d stale-while-revalidate
const CACHE_CONTROL_HEADER_VALUE = "public, s-maxage=86400, stale-while-revalidate=604800";

// In-memory cache for social feed results
const cache = new Map<string, { posts: SocialPost[]; timestamp: number }>();
// In-flight request coalescing per cache key (prevents stampedes per instance)
const inflight = new Map<string, Promise<SocialPost[]>>();

export interface SocialPost {
  id: string;
  content: string;
  author: string;
  handle: string;
  timestamp: string;
  url: string;
  likes?: number;
  retweets?: number;
}

// Fallback mock data for when API has no credits
const MOCK_POSTS: SocialPost[] = [
  {
    id: "1",
    content:
      "Exciting new research on AI-assisted ECG analysis for early detection of atrial fibrillation. The future of cardiology diagnostics is here! 🫀 #Cardiology #AI #MedTwitter",
    author: "Dr. Sarah Chen",
    handle: "@DrSarahChen_MD",
    timestamp: "2h",
    url: "https://x.com/search?q=cardiology%20research",
    likes: 342,
    retweets: 89,
  },
  {
    id: "2",
    content:
      "New NEJM paper: SGLT2 inhibitors show remarkable heart failure benefits even in non-diabetic patients. This changes our treatment paradigm completely.\n\nThread 🧵👇",
    author: "Cardiology Updates",
    handle: "@CardiologyToday",
    timestamp: "4h",
    url: "https://x.com/search?q=SGLT2%20heart%20failure",
    likes: 1205,
    retweets: 456,
  },
  {
    id: "3",
    content:
      "Just presented our team's research on machine learning for predicting sudden cardiac death risk at #AHA2024. Incredible response from the cardiology community! 📊",
    author: "Dr. Michael Torres",
    handle: "@MTorres_Cardio",
    timestamp: "6h",
    url: "https://x.com/search?q=AHA2024%20cardiology",
    likes: 567,
    retweets: 123,
  },
  {
    id: "4",
    content:
      "The latest meta-analysis on GLP-1 agonists and cardiovascular outcomes is remarkable. Consistent mortality benefits across all major trials. A new era in cardiometabolic medicine.",
    author: "Heart Research Network",
    handle: "@HeartResearchNet",
    timestamp: "8h",
    url: "https://x.com/search?q=GLP1%20cardiovascular",
    likes: 892,
    retweets: 234,
  },
  {
    id: "5",
    content:
      "Fascinating case: 45yo with unexplained syncope. Holter showed intermittent complete heart block. Genetic testing revealed SCN5A mutation. Always think beyond the obvious! #CardioTwitter",
    author: "EP Fellowship",
    handle: "@EPFellowship",
    timestamp: "12h",
    url: "https://x.com/search?q=cardiology%20case",
    likes: 423,
    retweets: 67,
  },
  {
    id: "6",
    content:
      "New ESC guidelines on acute coronary syndromes are out! Key changes:\n\n✅ Earlier invasive strategy\n✅ Updated antithrombotic regimens\n✅ Focus on complete revascularization\n\nFull summary thread below 👇",
    author: "ESC Press",
    handle: "@escabordo",
    timestamp: "1d",
    url: "https://x.com/search?q=ESC%20guidelines%20cardiology",
    likes: 2341,
    retweets: 876,
  },
  {
    id: "7",
    content:
      "Our lab just published in Circulation: novel biomarker panel for early myocardial infarction detection with 98% sensitivity. Years of work finally paying off! 🎉",
    author: "Dr. Emily Watson",
    handle: "@EWatson_Research",
    timestamp: "1d",
    url: "https://x.com/search?q=circulation%20journal%20cardiology",
    likes: 1567,
    retweets: 445,
  },
  {
    id: "8",
    content:
      "Reminder: The connection between sleep apnea and cardiovascular disease is stronger than most realize. Screen your heart failure patients! 💤🫀 #PreventiveCardiology",
    author: "Preventive Cardiology",
    handle: "@PreventCardio",
    timestamp: "2d",
    url: "https://x.com/search?q=sleep%20apnea%20heart",
    likes: 678,
    retweets: 189,
  },
];

// Get cached posts if available and not expired
function getCachedPosts(query: string): SocialPost[] | null {
  const cached = cache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[Social Feed] Cache hit for query: "${query}"`);
    return cached.posts;
  }
  return null;
}

// Cache posts for a query
function setCachedPosts(query: string, posts: SocialPost[]) {
  cache.set(query, { posts, timestamp: Date.now() });
  console.log(`[Social Feed] Cached ${posts.length} posts for query: "${query}"`);
}

function normalizeQueryKey(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

function extractTweetIdFromUrl(url: string): string | null {
  const match = url.match(/\/status\/(\d+)/);
  return match ? match[1] : null;
}

function isValidXStatusUrl(url: string): boolean {
  // Accept both x.com and twitter.com status URLs.
  // Examples:
  // - https://x.com/user/status/123
  // - https://twitter.com/user/status/123
  return /^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\/[^\/]+\/status\/\d+/.test(url);
}

function cleanAndDedupePosts(input: SocialPost[]): SocialPost[] {
  const seen = new Set<string>();
  const out: SocialPost[] = [];

  for (const p of input) {
    if (!p || !p.content || !p.author || !p.handle || !p.url) continue;
    if (!isValidXStatusUrl(p.url)) continue;

    const tweetId = extractTweetIdFromUrl(p.url);
    const key = tweetId || p.id || p.url;
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);

    out.push({
      id: p.id || tweetId || key,
      content: p.content,
      author: p.author,
      handle: p.handle.startsWith("@") ? p.handle : `@${p.handle}`,
      timestamp: p.timestamp || "recently",
      url: p.url,
      likes: p.likes || 0,
      retweets: p.retweets || 0,
    });
  }

  return out;
}

function parseTimestampToAgeMinutes(ts: string | undefined | null): number | null {
  if (!ts) return null;
  const t = ts.trim().toLowerCase();
  const m = t.match(/^(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|wk|wks|week|weeks)$/);
  if (m) {
    const n = parseInt(m[1], 10);
    const unit = m[2];
    if (unit.startsWith("m")) return n;
    if (unit.startsWith("h")) return n * 60;
    if (unit.startsWith("d")) return n * 24 * 60;
    if (unit.startsWith("w")) return n * 7 * 24 * 60;
  }
  // e.g. "Dec 10" -> treat as unknown recency (provider-dependent)
  return null;
}

function computePostScore(post: SocialPost): number {
  const likes = Math.max(0, post.likes || 0);
  const rts = Math.max(0, post.retweets || 0);
  const engagement = Math.log10(1 + likes) + 0.8 * Math.log10(1 + rts);

  const ageMin = parseTimestampToAgeMinutes(post.timestamp);
  const recency = ageMin == null ? 0 : Math.max(0, 1 - ageMin / (24 * 60)); // 1.0 now -> 0 at 24h

  const text = (post.content || "").toLowerCase();
  const url = (post.url || "").toLowerCase();
  const hasPaperSignal =
    /doi\b|arxiv|medrxiv|biorxiv|preprint|randomized|rct\b|meta-analysis|systematic review|nejm|jama|lancet|circulation|nature|science/.test(text) ||
    /doi\.org|arxiv\.org|medrxiv\.org|biorxiv\.org|pubmed\.ncbi\.nlm\.nih\.gov/.test(url);

  const paperBoost = hasPaperSignal ? 0.8 : 0;
  return engagement * 1.5 + recency * 1.0 + paperBoost;
}

async function fetchPostsFromGrok(queryForPrompt: string): Promise<SocialPost[]> {
  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${XAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3",
      messages: [
        {
          role: "system",
          content: `You are a research assistant that finds real X/Twitter posts about cardiology and medical research.

IMPORTANT: Return REAL posts from X/Twitter with ACTUAL URLs that users can click to view the original post.

Return a JSON array with this exact structure:
[
  {
    "id": "unique_tweet_id",
    "content": "the actual tweet text",
    "author": "Real Display Name",
    "handle": "@realusername",
    "timestamp": "time like '2h' or 'Dec 10'",
    "url": "https://x.com/username/status/1234567890",
    "likes": 42,
    "retweets": 10
  }
]

Requirements:
- Return ONLY real posts you can verify exist on X
- Include the ACTUAL post URL in the format https://x.com/username/status/[tweet_id]
- Focus on posts from researchers, cardiologists, medical journals, and science communicators
- Include posts discussing cardiology papers, heart disease research, cardiovascular studies
- Prefer posts that link to papers (doi.org, arxiv.org, journals) when possible
- Return 10-14 posts
- Return ONLY the JSON array, no other text`,
        },
        {
          role: "user",
          content: `Search X/Twitter for recent posts about: ${queryForPrompt}. Find real posts from researchers, doctors, and medical professionals discussing cardiology research, heart studies, and cardiovascular medicine papers. Return only the JSON array with real, clickable post URLs.`,
        },
      ],
      search_parameters: {
        mode: "auto",
        sources: [
          {
            type: "x",
          },
        ],
      },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Grok API error:", errorText);
    return [];
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";

  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return cleanAndDedupePosts(parsed);
    }
  } catch (e) {
    console.error("Error parsing Grok response:", e);
    console.error("Raw content:", content);
  }

  return [];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryRaw = searchParams.get("query") || "cardiology research";
  const queryForPrompt = queryRaw.trim().replace(/\s+/g, " ") || "cardiology research";
  const queryKey = normalizeQueryKey(queryForPrompt) || "cardiology research";

  // Check cache first
  const cachedPosts = getCachedPosts(queryKey);
  if (cachedPosts) {
    return NextResponse.json(
      {
        posts: cachedPosts,
        cached: true,
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
        },
      }
    );
  }

  if (!XAI_API_KEY) {
    // Return mock data with a note
    return NextResponse.json(
      {
        posts: MOCK_POSTS,
        note: "Using sample data - XAI API key not configured",
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
        },
      }
    );
  }

  try {
    // Coalesce concurrent requests for the same query on this instance
    const existing = inflight.get(queryKey);
    if (existing) {
      const posts = await existing;
      return NextResponse.json(
        { posts, cached: false, coalesced: true },
        { headers: { "Cache-Control": CACHE_CONTROL_HEADER_VALUE } }
      );
    }

    const p = (async () => {
      // Two-query strategy for better recall:
      // - base query
      // - paper/link focused variant
      const q1 = queryForPrompt;
      const q2 = `${queryForPrompt} (paper OR doi OR arxiv OR preprint OR medrxiv OR biorxiv)`;

      const [a, b] = await Promise.all([fetchPostsFromGrok(q1), fetchPostsFromGrok(q2)]);
      const merged = cleanAndDedupePosts([...a, ...b]);

      // Deterministic ranking: engagement + recency + paper-link signals
      const ranked = [...merged].sort((x, y) => computePostScore(y) - computePostScore(x));

      const posts = ranked.slice(0, 12);
      if (posts.length === 0) return MOCK_POSTS;

      setCachedPosts(queryKey, posts);
      return posts;
    })();

    inflight.set(queryKey, p);
    const posts = await p.finally(() => inflight.delete(queryKey));

    return NextResponse.json(
      {
        posts,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching social feed:", error);
    // Return mock data on any error
    return NextResponse.json(
      {
        posts: MOCK_POSTS,
        note: "Using sample data - error occurred",
      },
      {
        headers: {
          "Cache-Control": CACHE_CONTROL_HEADER_VALUE,
        },
      }
    );
  }
}
