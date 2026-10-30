import { millis, percent } from "../format";
import type { LogEntry, ServiceSummary } from "../types";

interface Props {
  summary: ServiceSummary;
  label: string;
  entries: LogEntry[];
  onOpen: () => void;
}

export function ServiceBlock({ summary, label, entries, onOpen }: Props) {
  const alert = summary.errorRate > 0.15;
  const state = summary.totalCalls === 0 ? "Sin llamadas" : alert ? "Sobre el umbral" : "Saludable";
  const peak = Math.max(...entries.map((entry) => entry.durationMs), 1);

  return (
    <article className={alert ? "service is-alert" : "service"}>
      <div className="service-head">
        <h3 className="service-name">{label}</h3>
        <span className="service-state">{state}</span>
      </div>

      <div className="service-strip" aria-hidden="true">
        {entries.length === 0 && <span className="service-strip-empty">Sin tráfico</span>}
        {entries.map((entry) => (
          <span
            key={entry.requestId}
            className={entry.status === "ERROR" ? "bar is-error" : "bar"}
            style={{ height: `${Math.max(8, (entry.durationMs / peak) * 100)}%` }}
          />
        ))}
      </div>

      <dl className="service-stats">
        <div>
          <dt>Llamadas</dt>
          <dd>{summary.totalCalls.toLocaleString("es-CO")}</dd>
        </div>
        <div>
          <dt>Éxito</dt>
          <dd>{percent(1 - summary.errorRate)}</dd>
        </div>
        <div>
          <dt>Media</dt>
          <dd>{millis(summary.avgDurationMs)}</dd>
        </div>
      </dl>

      <button type="button" className="service-link" onClick={onOpen}>
        Ver registros
        <span aria-hidden="true">→</span>
      </button>
    </article>
  );
}
