import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";
import type { Filters, LogEntry, LogPage, Summary } from "./types";

const SERVICES = ["inventory", "orders", "payments"] as const;
const PAGE_SIZE = 12;

export function useDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [logs, setLogs] = useState<LogPage | null>(null);
  const [recent, setRecent] = useState<Record<string, LogEntry[]>>({});
  const [filters, setFilters] = useState<Filters>({ service: "", status: "", from: "", to: "" });
  const [page, setPage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [freshId, setFreshId] = useState<string | null>(null);
  const lastTop = useRef<string | null>(null);
  const flashTimer = useRef<number | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const [nextSummary, nextLogs, ...nextRecent] = await Promise.all([
        api.summary(),
        api.logs({ ...filters, page, size: PAGE_SIZE }),
        ...SERVICES.map((service) => api.logs({ service, size: 20 })),
      ]);

      const top = nextLogs.items[0]?.requestId ?? null;
      if (top && lastTop.current && top !== lastTop.current) {
        setFreshId(top);
        window.clearTimeout(flashTimer.current);
        flashTimer.current = window.setTimeout(() => setFreshId(null), 700);
      }
      lastTop.current = top;

      setSummary(nextSummary);
      setLogs(nextLogs);
      setRecent(
        Object.fromEntries(
          SERVICES.map((service, index) => [service, [...(nextRecent[index]?.items ?? [])].reverse()]),
        ),
      );
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo leer el backend");
    }
  }, [filters, page]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        void load();
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => () => window.clearTimeout(flashTimer.current), []);

  const updateFilter = (key: keyof Filters, value: string) => {
    setPage(0);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setPage(0);
    setFilters({ service: "", status: "", from: "", to: "" });
  };

  const simulate = async () => {
    setSimulating(true);
    try {
      const result = await api.simulate();
      setPage(0);
      await load();
      return result.generated;
    } finally {
      setSimulating(false);
    }
  };

  const totals = useMemo(() => {
    const services = summary?.services ?? [];
    const calls = services.reduce((sum, item) => sum + item.totalCalls, 0);
    const weightedErrors = services.reduce((sum, item) => sum + item.errorRate * item.totalCalls, 0);
    return {
      calls,
      errorRate: calls ? weightedErrors / calls : 0,
      services,
    };
  }, [summary]);

  return {
    summary,
    logs,
    recent,
    filters,
    page,
    totals,
    error,
    simulating,
    freshId,
    pageSize: PAGE_SIZE,
    setPage,
    updateFilter,
    clearFilters,
    simulate,
    reload: load,
  };
}
