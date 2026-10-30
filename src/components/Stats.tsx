import { millis, percent } from "../format";
import type { LogEntry, ServiceSummary } from "../types";

interface Props {
  recent: Record<string, LogEntry[]>;
  services: ServiceSummary[];
}

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
}

export function Stats({ recent, services }: Props) {
  const durations = Object.values(recent).flatMap((entries) =>
    entries.map((entry) => entry.durationMs),
  );
  const errors = services.reduce(
    (sum, service) => sum + service.errorRate * service.totalCalls,
    0,
  );
  const calls = services.reduce((sum, service) => sum + service.totalCalls, 0);
  const peak = durations.length ? Math.max(...durations) : 0;
  const window = durations.length;

  return (
    <dl className="stats">
      <div>
        <dt>p50</dt>
        <dd>{millis(percentile(durations, 0.5))}</dd>
      </div>
      <div>
        <dt>p95</dt>
        <dd>{millis(percentile(durations, 0.95))}</dd>
      </div>
      <div>
        <dt>Error global</dt>
        <dd className={calls > 0 && errors / calls > 0.15 ? "is-error" : undefined}>
          {percent(calls ? errors / calls : 0)}
        </dd>
      </div>
      <div>
        <dt>Pico</dt>
        <dd>{millis(peak)}</dd>
      </div>
      <p className="stats-note">Sobre las últimas {window || 0} llamadas registradas.</p>
    </dl>
  );
}
