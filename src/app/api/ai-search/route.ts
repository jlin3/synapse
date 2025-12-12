import { NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY;

interface SearchIntent {
  searchTerms: string[];
  filters: {
    dateRange?: string;
    minCitations?: number;
    studyType?: string;
  };
  explanation: string;
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // If no API key, do simple keyword extraction
    if (!XAI_API_KEY) {
      return NextResponse.json({
        searchTerms: [query],
        filters: {},
        explanation: `Searching for: ${query}`,
      });
    }

    const systemPrompt = `You are a research paper search assistant. Given a natural language query about academic research, extract:
1. Key search terms (for searching paper titles/abstracts)
2. Any filters (date range, minimum citations, study type like RCT, meta-analysis, etc.)
3. A brief explanation of what you're searching for

Return ONLY valid JSON in this format:
{
  "searchTerms": ["term1", "term2"],
  "filters": {
    "dateRange": "2020-2024" or null,
    "minCitations": 10 or null,
    "studyType": "RCT" or "meta-analysis" or null
  },
  "explanation": "Brief explanation"
}`;

    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "grok-3-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      // Fallback to simple search
      return NextResponse.json({
        searchTerms: [query],
        filters: {},
        explanation: `Searching for: ${query}`,
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: SearchIntent = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    // Fallback
    return NextResponse.json({
      searchTerms: [query],
      filters: {},
      explanation: `Searching for: ${query}`,
    });
  } catch (error) {
    console.error("AI search error:", error);
    return NextResponse.json({ error: "Failed to process search query" }, { status: 500 });
  }
}
