import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile, projects, experience } from "@/data/profile";
import { recordGeminiUsage } from "@/lib/gemini-usage";

export async function POST(request: Request) {
  try {
    const { question, language = "en" } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
          { error: "Please enter a question." },
          { status: 400 }
      );
    }

    const responseLanguage = language === "hi" ? "Hindi" : language === "fr" ? "French" : "English";

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

    if (!apiKey || apiKey === "your_key") {
      return NextResponse.json(
          {
            error:
                "GEMINI_API_KEY is missing or incomplete in .env.local.",
          },
          { status: 500 }
      );
    }

    const portfolioContext = JSON.stringify({
      profile,
      projects,
      experience,
    });
    let resumeContext = "No additional resume was provided.";

    try {
      const resume = await readFile(
        path.join(process.cwd(), "data", "resume.txt"),
        "utf8"
      );
      if (resume.trim()) {
        resumeContext = resume.trim();
      }
    } catch {
      // The structured portfolio data remains available if the optional file is absent.
    }

    const instructions = `
You are the AI Portfolio Assistant for ${profile.name}.

Answer questions about the developer's professional experience,
skills, projects, education and technical background.

Use ONLY the portfolio information provided below.
Do not invent companies, dates, technologies, achievements or experience.

If the requested information isn't available, say that it isn't specified
in the portfolio.

Keep answers professional and useful for recruiters and hiring managers.
Respond entirely in ${responseLanguage}, including headings and bullet points.

PORTFOLIO DATA:
${portfolioContext}

RESUME:
${resumeContext}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: instructions }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: question.slice(0, 4000) }],
              },
            ],
          }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", {
        status: response.status,
        model,
        error: data?.error,
      });

      return NextResponse.json(
          {
            error:
                data?.error?.message ||
                `Gemini API returned HTTP ${response.status}`,
          },
          { status: response.status }
      );
    }

    const answer = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      ?.join("")
      ?.trim();

    if (!answer) {
      return NextResponse.json(
          {
            error: "Gemini returned an empty response.",
          },
          { status: 500 }
      );
    }

    const usageMetadata = data?.usageMetadata;
    recordGeminiUsage({
      model,
      language: responseLanguage,
      promptTokens: usageMetadata?.promptTokenCount ?? 0,
      outputTokens: usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: usageMetadata?.totalTokenCount ?? 0,
    });

    return NextResponse.json({
      answer,
    });
  } catch (error) {
    console.error("Portfolio AI error:", error);

    return NextResponse.json(
        {
          error:
              error instanceof Error
                  ? error.message
                  : "Unknown server error",
        },
        { status: 500 }
    );
  }
}