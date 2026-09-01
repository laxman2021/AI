"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

type UsageRecord = {
  timestamp: string;
  model: string;
  language: string;
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
};

type Usage = {
  model: string;
  requests: number;
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  recent: UsageRecord[];
};

const emptyUsage: Usage = {
  model: "-",
  requests: 0,
  promptTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  recent: [],
};

export default function AdminUsagePage() {
  const [usage, setUsage] = useState<Usage>(emptyUsage);
  const [token, setToken] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsage(accessToken = token) {
    setLoading(true);
    setError("");
    const response = await fetch(`${API_BASE_URL}/api/admin/usage`, {
      headers: accessToken ? { "x-admin-token": accessToken } : undefined,
      cache: "no-store",
    });

    if (response.status === 401) {
      setAuthorized(false);
      setError("Enter the admin token to view usage.");
      setLoading(false);
      return;
    }

    if (!response.ok) {
      setError("Usage data could not be loaded.");
      setLoading(false);
      return;
    }

    setUsage(await response.json());
    setAuthorized(true);
    setLoading(false);
  }

  useEffect(() => {
    const savedToken = sessionStorage.getItem("portfolio-admin-token") || "";
    setToken(savedToken);
    void loadUsage(savedToken);
  }, []);

  function submitToken(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sessionStorage.setItem("portfolio-admin-token", token);
    void loadUsage(token);
  }

  return (
    <main className="admin-page">
      <div className="admin-shell">
        <div className="admin-header">
          <div>
            <span className="eyebrow">ADMINISTRATION</span>
            <h1>Gemini API Usage</h1>
            <p>Usage recorded by this application instance for model {usage.model}.</p>
          </div>
          <a className="button ghost" href="/">Back to portfolio</a>
        </div>

        {!authorized && (
          <form className="admin-auth" onSubmit={submitToken}>
            <label htmlFor="admin-token">Admin token</label>
            <div>
              <input id="admin-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} placeholder="ADMIN_TOKEN" />
              <button className="button primary">View usage</button>
            </div>
            {error && <p>{error}</p>}
          </form>
        )}

        {authorized && (
          <>
            <div className="usage-actions">
              <span>{loading ? "Refreshing..." : "Live instance totals"}</span>
              <button className="button ghost" onClick={() => void loadUsage()}>Refresh</button>
            </div>
            <div className="usage-grid">
              <div className="usage-card"><span>Requests</span><strong>{usage.requests.toLocaleString()}</strong></div>
              <div className="usage-card"><span>Prompt tokens</span><strong>{usage.promptTokens.toLocaleString()}</strong></div>
              <div className="usage-card"><span>Output tokens</span><strong>{usage.outputTokens.toLocaleString()}</strong></div>
              <div className="usage-card"><span>Total tokens</span><strong>{usage.totalTokens.toLocaleString()}</strong></div>
            </div>
            <section className="usage-table-section">
              <h2>Recent requests</h2>
              {usage.recent.length === 0 ? <p>No Gemini requests recorded yet.</p> : (
                <div className="usage-table-wrap">
                  <table>
                    <thead><tr><th>Time</th><th>Language</th><th>Prompt</th><th>Output</th><th>Total</th></tr></thead>
                    <tbody>{usage.recent.map((record) => <tr key={record.timestamp}><td>{new Date(record.timestamp).toLocaleString()}</td><td>{record.language}</td><td>{record.promptTokens.toLocaleString()}</td><td>{record.outputTokens.toLocaleString()}</td><td>{record.totalTokens.toLocaleString()}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
