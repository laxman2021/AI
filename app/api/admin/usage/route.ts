import { NextResponse } from "next/server";
import { getGeminiUsage } from "@/lib/gemini-usage";

export const runtime = "nodejs";

export function GET(request: Request) {
  const configuredToken = process.env.ADMIN_TOKEN;
  const suppliedToken = request.headers.get("x-admin-token");

  if (configuredToken && suppliedToken !== configuredToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ model: process.env.GEMINI_MODEL || "gemini-3.6-flash", ...getGeminiUsage() });
}
