import { NextResponse } from "next/server";
import { getGeminiUsage } from "@/lib/gemini-usage";

export const runtime = "nodejs";

export function GET() {
  const { requests, promptTokens, outputTokens, totalTokens } = getGeminiUsage();
  return NextResponse.json({ requests, promptTokens, outputTokens, totalTokens });
}
