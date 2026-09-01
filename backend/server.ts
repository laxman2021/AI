import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { readFile } from "node:fs/promises";
// import path from "node:path";
import { experience, profile, projects } from "../data/profile";
import { getGeminiUsage, recordGeminiUsage } from "../lib/gemini-usage";

// dotenv.config({ path: path.join(process.cwd(), ".env.local") });
dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_request, response) => response.json({ ok: true }));

app.get("/api/github", async (_request, response) => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const githubResponse = await fetch("https://api.github.com/users/laxman2021/repos?sort=updated&per_page=12", { headers });
    if (!githubResponse.ok) return response.json({ repos: [] });
    const repositories = await githubResponse.json() as Array<Record<string, unknown>>;
    return response.json({
      repos: repositories.filter((repo) => !repo.fork).map((repo) => ({
        name: repo.name,
        html_url: repo.html_url,
        description: repo.description,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        fork: repo.fork,
      })),
    });
  } catch {
    return response.json({ repos: [] });
  }
});

app.get("/api/usage", (_request, response) => {
  const { requests, promptTokens, outputTokens, totalTokens } = getGeminiUsage();
  return response.json({ requests, promptTokens, outputTokens, totalTokens });
});

app.get("/api/admin/usage", (request, response) => {
  if (!process.env.ADMIN_TOKEN || request.header("x-admin-token") !== process.env.ADMIN_TOKEN) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  return response.json({ model: process.env.GEMINI_MODEL || "gemini-3.6-flash", ...getGeminiUsage() });
});

app.post("/api/chat", async (request, response) => {
  try {
    const { question, language = "en" } = request.body as { question?: unknown; language?: string };
    if (!question || typeof question !== "string") return response.status(400).json({ error: "Please enter a question." });

    const responseLanguage = language === "hi" ? "Hindi" : language === "fr" ? "French" : "English";
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    if (!apiKey || apiKey === "your_key") return response.status(500).json({ error: "GEMINI_API_KEY is missing or incomplete in the backend environment." });

    const portfolioContext = JSON.stringify({ profile, projects, experience });
    let resumeContext = "No additional resume was provided.";
    try {
      const resume = await readFile(path.join(process.cwd(), "data", "resume.txt"), "utf8");
      if (resume.trim()) resumeContext = resume.trim();
    } catch {
      // Structured portfolio data remains available when the optional resume is absent.
    }

    const instructions = `
You are the AI Portfolio Assistant for ${profile.name}.

Answer questions about the developer's professional experience, skills, projects, education and technical background.
Use ONLY the portfolio information provided below. Do not invent companies, dates, technologies, achievements or experience.
If the requested information isn't available, say that it isn't specified in the portfolio.
Keep answers professional and useful for recruiters and hiring managers.
Respond entirely in ${responseLanguage}, including headings and bullet points.

PORTFOLIO DATA:
${portfolioContext}

RESUME:
${resumeContext}
`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instructions }] },
        contents: [{ role: "user", parts: [{ text: question.slice(0, 4000) }] }],
      }),
    });
    const data = await geminiResponse.json() as { error?: { message?: string }; candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>; usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number } };
    if (!geminiResponse.ok) return response.status(geminiResponse.status).json({ error: data.error?.message || `Gemini API returned HTTP ${geminiResponse.status}` });

    const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!answer) return response.status(500).json({ error: "Gemini returned an empty response." });

    recordGeminiUsage({
      model,
      language: responseLanguage,
      promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
      outputTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
      totalTokens: data.usageMetadata?.totalTokenCount ?? 0,
    });
    return response.json({ answer });
  } catch (error) {
    console.error("Portfolio AI error:", error);
    return response.status(500).json({ error: error instanceof Error ? error.message : "Unknown server error" });
  }
});

app.listen(port, () => console.log(`Portfolio backend listening on port ${port}`));
