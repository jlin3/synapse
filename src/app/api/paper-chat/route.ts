import { NextResponse } from "next/server";

const XAI_API_KEY = process.env.XAI_API_KEY;

export async function POST(request: Request) {
  try {
    const { question, title, abstract } = await request.json();

    if (!question || !title) {
      return NextResponse.json(
        { error: "Question and paper title are required" },
        { status: 400 }
      );
    }

    // If no API key, return a helpful message
    if (!XAI_API_KEY) {
      return NextResponse.json({
        answer: generateFallbackAnswer(question, title, abstract),
      });
    }

    const systemPrompt = `You are an AI research assistant helping users understand academic papers. 
You have access to the following paper:

Title: ${title}
${abstract ? `Abstract: ${abstract}` : ""}

Answer questions about this paper concisely and helpfully. If the question cannot be answered based on the available information, say so clearly.
Keep responses under 200 words unless more detail is specifically requested.`;

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
          { role: "user", content: question },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Grok API error:", errorData);
      
      return NextResponse.json({
        answer: generateFallbackAnswer(question, title, abstract),
      });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Paper chat error:", error);
    return NextResponse.json(
      { error: "Failed to process your question" },
      { status: 500 }
    );
  }
}

function generateFallbackAnswer(question: string, title: string, abstract: string | null): string {
  const questionLower = question.toLowerCase();
  
  // Basic question handling based on keywords
  if (questionLower.includes("what is") || questionLower.includes("about")) {
    if (abstract) {
      return `Based on the abstract, this paper "${title}" ${abstract.slice(0, 300)}...`;
    }
    return `This paper is titled "${title}". I'd need more context from the full paper to provide detailed information.`;
  }
  
  if (questionLower.includes("method") || questionLower.includes("approach")) {
    if (abstract && abstract.toLowerCase().includes("method")) {
      const methodIdx = abstract.toLowerCase().indexOf("method");
      return `Regarding methodology: ${abstract.slice(Math.max(0, methodIdx - 50), methodIdx + 200)}...`;
    }
    return "The methodology details would need to be extracted from the full paper text.";
  }
  
  if (questionLower.includes("result") || questionLower.includes("finding") || questionLower.includes("conclusion")) {
    if (abstract) {
      const keywords = ["result", "found", "show", "conclude", "demonstrate"];
      for (const kw of keywords) {
        const idx = abstract.toLowerCase().indexOf(kw);
        if (idx > -1) {
          return `Key finding: ${abstract.slice(Math.max(0, idx - 20), idx + 200)}...`;
        }
      }
    }
    return "The detailed results would need to be extracted from the full paper text.";
  }

  // Default response
  if (abstract) {
    return `Based on "${title}": ${abstract.slice(0, 250)}... For more specific details, please refer to the full paper.`;
  }
  
  return `I can help answer questions about "${title}" but would need more context from the paper's content to provide specific details.`;
}
