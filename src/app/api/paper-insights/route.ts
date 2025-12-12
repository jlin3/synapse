import { NextResponse } from "next/server";
import { PaperInsights } from "@/types";

const XAI_API_KEY = process.env.XAI_API_KEY;

interface PaperInsightsRequest {
  title: string;
  abstract: string | null;
}

// Fallback insights when API is unavailable
function generateFallbackInsights(title: string, abstract: string | null): PaperInsights {
  return {
    synthesis: abstract
      ? `This research paper "${title}" explores important findings in the field. The study presents methodological approaches and results that contribute to our understanding of the topic.`
      : `This paper titled "${title}" presents research findings that may be relevant to practitioners and researchers in the field.`,
    eli5: `Scientists did a study called "${title}". They wanted to learn something new and important. They looked at information carefully and found some interesting things that can help other scientists and maybe help people too!`,
    highlights: [
      "The study addresses an important research question in the field",
      "Methodology and approach are detailed in the paper",
      "Results contribute to existing knowledge base",
      "Further research may build on these findings",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const body: PaperInsightsRequest = await request.json();
    const { title, abstract } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!XAI_API_KEY) {
      // Return fallback insights if no API key
      return NextResponse.json(generateFallbackInsights(title, abstract));
    }

    const systemPrompt = `You are a scientific research expert who helps people understand academic papers. You provide clear, accurate, and accessible explanations of research papers.

Given a paper's title and abstract, provide:
1. A synthesis (2-3 sentences summarizing the key findings and significance)
2. An ELI5 explanation (Explain Like I'm 5 - simple language anyone can understand, 2-3 sentences)
3. Key highlights (3-5 bullet points of the most important takeaways)

Return ONLY valid JSON in this exact format:
{
  "synthesis": "Your synthesis here...",
  "eli5": "Your simple explanation here...",
  "highlights": ["Point 1", "Point 2", "Point 3"]
}

Be accurate and base your response on the actual content provided. If the abstract is not available, make reasonable inferences from the title but note any limitations.`;

    const userPrompt = `Please analyze this research paper:

Title: ${title}

Abstract: ${abstract || "Abstract not available"}

Provide the synthesis, ELI5 explanation, and highlights in JSON format.`;

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
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API error:", errorText);
      // Return fallback on API error
      return NextResponse.json(generateFallbackInsights(title, abstract));
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON response
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const insights: PaperInsights = JSON.parse(jsonMatch[0]);

        // Validate the response structure
        if (
          typeof insights.synthesis === "string" &&
          typeof insights.eli5 === "string" &&
          Array.isArray(insights.highlights)
        ) {
          return NextResponse.json(insights);
        }
      }

      // If parsing fails, return fallback
      console.error("Failed to parse Grok response:", content);
      return NextResponse.json(generateFallbackInsights(title, abstract));
    } catch (parseError) {
      console.error("Error parsing Grok response:", parseError);
      return NextResponse.json(generateFallbackInsights(title, abstract));
    }
  } catch (error) {
    console.error("Error generating paper insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
