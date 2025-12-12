import { NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY;

// Cache duration: 1 hour (in milliseconds)
const CACHE_DURATION = 60 * 60 * 1000;

// In-memory cache for social feed results
const cache = new Map<string, { posts: SocialPost[]; timestamp: number }>();

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "cardiology research";

  // Check cache first
  const cachedPosts = getCachedPosts(query);
  if (cachedPosts) {
    return NextResponse.json(
      {
        posts: cachedPosts,
        cached: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  }

  if (!XAI_API_KEY) {
    // Return mock data with a note
    return NextResponse.json({
      posts: MOCK_POSTS,
      note: "Using sample data - XAI API key not configured",
    });
  }

  try {
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

IMPORTANT: You must return REAL posts from X/Twitter with ACTUAL URLs that users can click to view the original post.

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
- Return 8-12 posts
- Return ONLY the JSON array, no other text`,
          },
          {
            role: "user",
            content: `Search X/Twitter for recent posts about: ${query}. Find real posts from researchers, doctors, and medical professionals discussing cardiology research, heart studies, and cardiovascular medicine papers. Return only the JSON array with real, clickable post URLs.`,
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

      // If API fails (no credits, etc), return mock data
      return NextResponse.json({
        posts: MOCK_POSTS,
        note: "Using sample data - API temporarily unavailable",
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";

    // Parse the JSON response from Grok
    let posts: SocialPost[] = [];
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate and clean the posts
        posts = parsed
          .filter(
            (post: SocialPost) =>
              post.content &&
              post.author &&
              post.handle &&
              post.url &&
              (post.url.includes("x.com") || post.url.includes("twitter.com"))
          )
          .map((post: SocialPost, index: number) => ({
            id: post.id || `post-${index}`,
            content: post.content,
            author: post.author,
            handle: post.handle.startsWith("@") ? post.handle : `@${post.handle}`,
            timestamp: post.timestamp || "recently",
            url: post.url,
            likes: post.likes || 0,
            retweets: post.retweets || 0,
          }));
      }
    } catch (parseError) {
      console.error("Error parsing Grok response:", parseError);
      console.error("Raw content:", content);
      // Return mock data on parse error
      return NextResponse.json({
        posts: MOCK_POSTS,
        note: "Using sample data - parse error",
      });
    }

    // If no posts found, return mock data
    if (posts.length === 0) {
      return NextResponse.json({
        posts: MOCK_POSTS,
        note: "Using sample data - no results",
      });
    }

    // Cache the successful response
    setCachedPosts(query, posts);

    return NextResponse.json(
      {
        posts,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching social feed:", error);
    // Return mock data on any error
    return NextResponse.json({
      posts: MOCK_POSTS,
      note: "Using sample data - error occurred",
    });
  }
}
