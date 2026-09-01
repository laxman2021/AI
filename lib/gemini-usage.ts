export type GeminiUsageRecord = {
  timestamp: string;
  model: string;
  language: string;
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
};

type GeminiUsageState = {
  requests: number;
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  recent: GeminiUsageRecord[];
};

declare global {
  var geminiUsage: GeminiUsageState | undefined;
}

const usage: GeminiUsageState = globalThis.geminiUsage ?? {
  requests: 0,
  promptTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  recent: [],
};

globalThis.geminiUsage = usage;

export function recordGeminiUsage(record: Omit<GeminiUsageRecord, "timestamp">) {
  usage.requests += 1;
  usage.promptTokens += record.promptTokens;
  usage.outputTokens += record.outputTokens;
  usage.totalTokens += record.totalTokens;
  usage.recent.unshift({ ...record, timestamp: new Date().toISOString() });
  usage.recent = usage.recent.slice(0, 50);
}

export function getGeminiUsage() {
  return {
    requests: usage.requests,
    promptTokens: usage.promptTokens,
    outputTokens: usage.outputTokens,
    totalTokens: usage.totalTokens,
    recent: usage.recent,
  };
}
