import { NextResponse } from "next/server";

export async function GET() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const response = await fetch("https://api.github.com/users/laxman2021/repos?sort=updated&per_page=12", {
      headers,
      next: { revalidate: 3600 }
    });
    if (!response.ok) return NextResponse.json({ repos: [] }, { status: 200 });
    const repos = await response.json();
    return NextResponse.json({
      repos: repos.filter((r: any) => !r.fork).map((r: any) => ({
        name: r.name,
        html_url: r.html_url,
        description: r.description,
        stargazers_count: r.stargazers_count,
        language: r.language,
        fork: r.fork
      }))
    });
  } catch {
    return NextResponse.json({ repos: [] }, { status: 200 });
  }
}
