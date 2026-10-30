import { Fragment, useState } from "react";
import { dayTime, millis, serviceLabel, time } from "../format";
import type { LogEntry } from "../types";

interface Props {
  entries: LogEntry[];
  freshId: string | null;
  empty: boolean;
}

export function LogsTable({ entries, freshId, empty }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  if (empty) {
    return (
      <div className="logs-empty">
        <p>Sin registros con estos filtros.</p>
        <p className="logs-empty-note">Prueba «Simular carga» o limpia los filtros.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="logs-table">
        <thead>
          <tr>
            <th scope="col">Hora</th>
            <th scope="col">Servicio</th>
            <th scope="col">Operación</th>
            <th scope="col" className="num">
              Duración
            </th>
            <th scope="col">Estado</th>
            <th scope="col" className="id">
              requestId
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const expanded = open === entry.requestId;
            return (
              <Fragment key={entry.requestId}>
                <tr
                  className={freshId === entry.requestId ? "is-new" : undefined}
                  onClick={() => setOpen(expanded ? null : entry.requestId)}
                >
                  <td className="mono">{time(entry.timestamp)}</td>
                  <td>{serviceLabel(entry.serviceId)}</td>
                  <td>
                    <button
                      type="button"
                      className="row-toggle mono"
                      aria-expanded={expanded}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpen(expanded ? null : entry.requestId);
                      }}
                    >
                      {entry.operation}
                    </button>
                  </td>
                  <td className="num mono">{millis(entry.durationMs)}</td>
                  <td>
                    <span className={entry.status === "ERROR" ? "status is-error" : "status"}>
                      <span className="status-mark" aria-hidden="true" />
                      {entry.status}
                    </span>
                  </td>
                  <td className="mono id" title={entry.requestId}>
                    {entry.requestId.slice(0, 8)}
                  </td>
                </tr>

                {expanded && (
                  <tr className="log-detail">
                    <td colSpan={6}>
                      <div className="detail-meta">
                        <span className="mono">{entry.requestId}</span>
                        <span>{dayTime(entry.timestamp)}</span>
                      </div>
                      <div className="detail-grid">
                        <section>
                          <h4>Parámetros de entrada</h4>
                          <pre>{JSON.stringify(entry.params, null, 2)}</pre>
                        </section>
                        <section>
                          <h4>{entry.error ? "Error" : "Respuesta completa"}</h4>
                          <pre className={entry.error ? "is-error" : undefined}>
                            {JSON.stringify(entry.error ?? entry.result, null, 2)}
                          </pre>
                        </section>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
