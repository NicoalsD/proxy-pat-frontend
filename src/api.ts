import type { Filters, LogPage, Summary } from "./types";

const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function get<T>(path: string, query?: Record<string, string | number>): Promise<T> {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== "" && value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`El backend respondió ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  summary: () => get<Summary>("/api/metrics/summary"),

  logs: (filters: Partial<Filters> & { page?: number; size?: number }) =>
    get<LogPage>("/api/metrics/logs", {
      service: filters.service ?? "",
      status: filters.status ?? "",
      from: filters.from ?? "",
      to: filters.to ?? "",
      page: filters.page ?? 0,
      size: filters.size ?? 12,
    }),

  simulate: async () => {
    const response = await fetch(`${BASE}/api/metrics/simulate-load`, { method: "POST" });
    if (!response.ok) {
      throw new Error(`La simulación falló con ${response.status}`);
    }
    return response.json() as Promise<{ generated: number }>;
  },
};
