import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SERVICES, millis } from "../format";
import type { LogEntry, ServiceSummary } from "../types";

interface Props {
  recent: Record<string, LogEntry[]>;
  summary: ServiceSummary[];
}

const INK = ["#141412", "#6C6961", "#8C8982"];
const SIGNAL = "#A8231B";

/** Solo las llamadas que fallaron llevan la tinta roja: el error es el dato que importa. */
const errorDot = (entries: LogEntry[]) =>
  function dot(props: { cx?: number; cy?: number; index?: number }) {
    const entry = entries[props.index ?? -1];
    if (!entry || entry.status !== "ERROR" || props.cx == null || props.cy == null) {
      return <g />;
    }
    return <circle cx={props.cx} cy={props.cy} r={2.6} fill={SIGNAL} />;
  };

export function LatencyChart({ recent, summary }: Props) {
  const series = SERVICES.map((service, index) => {
    const entries = recent[service.id] ?? [];
    const stats = summary.find((item) => item.serviceId === service.id);
    const alert = (stats?.errorRate ?? 0) > 0.15;
    return { ...service, entries, color: alert ? SIGNAL : INK[index], stats };
  });

  const length = Math.max(...series.map((item) => item.entries.length), 0);
  const data = Array.from({ length }, (_, index) => {
    const row: Record<string, number | string | null> = { call: index + 1 };
    for (const item of series) {
      const entry = item.entries[index];
      row[item.id] = entry ? entry.durationMs : null;
    }
    return row;
  });

  return (
    <figure className="chart">
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 12, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="rgba(20,20,18,0.14)" />
            <XAxis dataKey="call" hide />
            <YAxis
              width={44}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6C6961", fontFamily: "Spline Sans Mono, monospace" }}
              tickFormatter={(value: number) => `${value}`}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ stroke: "rgba(20,20,18,0.28)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="chart-tooltip">
                    <p className="chart-tooltip-title">Llamada {String(label)}</p>
                    {payload.map((point) => {
                      const item = series.find((entry) => entry.id === point.dataKey);
                      const entry = item?.entries[Number(label) - 1];
                      return (
                        <p key={String(point.dataKey)} className="chart-tooltip-row">
                          <span>{item?.label ?? String(point.dataKey)}</span>
                          <span className={entry?.status === "ERROR" ? "is-error" : ""}>
                            {millis(Number(point.value))}
                            {entry?.status === "ERROR" ? " · error" : ""}
                          </span>
                        </p>
                      );
                    })}
                  </div>
                );
              }}
            />
            {series.map((item) => (
              <Line
                key={item.id}
                type="linear"
                dataKey={item.id}
                stroke={item.color}
                strokeWidth={1.5}
                dot={errorDot(item.entries)}
                activeDot={{ r: 3, strokeWidth: 0, fill: item.color }}
                isAnimationActive={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <figcaption className="chart-legend">
        <span className="chart-legend-label">Última llamada</span>
        {series.map((item) => {
          const last = item.entries[item.entries.length - 1];
          return (
            <span key={item.id} className="chart-legend-item">
              <span className="chart-swatch" style={{ background: item.color }} />
              {item.label}
              <span className="chart-legend-value">{last ? millis(last.durationMs) : "—"}</span>
            </span>
          );
        })}
      </figcaption>
    </figure>
  );
}
