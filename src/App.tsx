import { useState } from "react";
import { Filters } from "./components/Filters";
import { LatencyChart } from "./components/LatencyChart";
import { LogsTable } from "./components/LogsTable";
import { Mark } from "./components/Mark";
import { ServiceBlock } from "./components/ServiceBlock";
import { Stats } from "./components/Stats";
import { SERVICES, count, percent, serviceLabel, time } from "./format";
import { useDashboard } from "./useDashboard";

export default function App() {
  const dashboard = useDashboard();
  const [announcement, setAnnouncement] = useState("");

  const services = dashboard.summary?.services ?? [];
  const worst = [...services].sort((a, b) => b.errorRate - a.errorRate)[0];
  const calls = dashboard.totals.calls;
  const generated = dashboard.summary?.generatedAt;

  const failing = services.filter((service) => service.errorRate > 0);
  const finding = !worst || worst.totalCalls === 0
    ? "Todavía no hay llamadas: usa «Simular carga» para poblar el dashboard."
    : worst.errorRate > 0.15
      ? `${serviceLabel(worst.serviceId)} supera el umbral del 15 %: ${percent(worst.errorRate)} de error.`
      : failing.length > 1
        ? `${serviceLabel(worst.serviceId)} lidera los fallos con ${percent(worst.errorRate)}; el umbral es 15 %.`
        : worst.errorRate > 0
          ? `Solo ${serviceLabel(worst.serviceId).toLowerCase()} ha fallado: ${percent(worst.errorRate)} de error.`
          : "Ningún servicio ha fallado desde el arranque.";

  const onSimulate = async () => {
    try {
      const generatedCalls = await dashboard.simulate();
      setAnnouncement(`${generatedCalls} llamadas generadas y registradas.`);
    } catch {
      setAnnouncement("No se pudo ejecutar la simulación.");
    }
  };

  const openLogs = (service: string) => {
    dashboard.updateFilter("service", service);
    document.getElementById("registros")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <div className="microbar">
        <span>Taller de patrones · proxy de microservicios</span>
        <span className="microbar-right">3 servicios · 1 proxy · umbral de error 15 %</span>
      </div>

      <header className="masthead">
        <nav className="nav" aria-label="Secciones">
          <a href="#resumen">Resumen</a>
          <a href="#latencia">Latencia</a>
          <a href="#registros">Registros</a>
        </nav>

        <a className="wordmark" href="#resumen" aria-label="Proxy Pat, inicio">
          <Mark />
          Proxy Pat
        </a>

        <div className="mast-actions">
          <span className="live">
            <span className="live-dot" aria-hidden="true" />
            En vivo · {generated ? time(generated) : "—"}
          </span>
          <button
            type="button"
            className="button-primary"
            onClick={onSimulate}
            disabled={dashboard.simulating}
          >
            {dashboard.simulating ? "Simulando…" : "Simular carga"}
          </button>
        </div>
      </header>

      <main id="contenido">
        {dashboard.error && (
          <div className="error-banner" role="alert">
            <span>{dashboard.error}</span>
            <button type="button" className="text-button" onClick={() => void dashboard.reload()}>
              Reintentar
            </button>
          </div>
        )}

        <section className="hero" id="resumen" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Tres servicios, una sola traza.</h1>
            <p className="lede">
              Inventario, pedidos y pagos pasan por el mismo proxy, que mide cada llamada y deja su
              registro. Esto es lo que ve el proxy mientras trabajan.
            </p>
            <p className={worst && worst.errorRate > 0.15 ? "finding is-alert" : "finding"}>
              <span className="finding-mark" aria-hidden="true" />
              {finding}
            </p>
          </div>

          <div className="monument">
            <span className="monument-value">{count(calls)}</span>
            <span className="monument-label">llamadas registradas</span>
            <span className="monument-note">desde el arranque · refresco cada 3 s</span>
          </div>
        </section>

        <section className="band" aria-labelledby="band-title">
          <div className="band-inner">
            <div className="band-head">
              <h2 id="band-title">Servicios</h2>
              <span>Últimas 20 llamadas de cada uno · se resalta en rojo sobre 15 % de error</span>
            </div>

            <div className="service-grid">
              {SERVICES.map((service) => {
                const stats = services.find((item) => item.serviceId === service.id);
                return (
                  <ServiceBlock
                    key={service.id}
                    label={service.label}
                    summary={
                      stats ?? {
                        serviceId: service.id,
                        totalCalls: 0,
                        errorRate: 0,
                        avgDurationMs: 0,
                      }
                    }
                    entries={dashboard.recent[service.id] ?? []}
                    onOpen={() => openLogs(service.id)}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <section className="latency" id="latencia" aria-labelledby="latency-title">
          <div className="section-head">
            <div>
              <h2 id="latency-title">Latencia</h2>
              <p>Las últimas 20 llamadas de cada servicio, en milisegundos.</p>
            </div>
          </div>

          <div className="latency-grid">
            <LatencyChart recent={dashboard.recent} summary={services} />
            <Stats recent={dashboard.recent} services={services} />
          </div>
        </section>

        <section className="logs" id="registros" aria-labelledby="logs-title">
          <div className="section-head">
            <div>
              <h2 id="logs-title">Registros</h2>
              <p>Cada llamada que pasó por el proxy, con su requestId y su duración.</p>
            </div>
          </div>

          <Filters
            filters={dashboard.filters}
            total={dashboard.logs?.total ?? 0}
            onChange={dashboard.updateFilter}
            onClear={dashboard.clearFilters}
          />

          <LogsTable
            entries={dashboard.logs?.items ?? []}
            freshId={dashboard.freshId}
            empty={(dashboard.logs?.total ?? 0) === 0}
          />

          <div className="pager">
            <button
              type="button"
              onClick={() => dashboard.setPage(Math.max(0, dashboard.page - 1))}
              disabled={dashboard.page === 0}
            >
              ← Anterior
            </button>
            <span>
              Página {dashboard.page + 1} de {Math.max(1, dashboard.logs?.totalPages ?? 1)}
            </span>
            <button
              type="button"
              onClick={() => dashboard.setPage(dashboard.page + 1)}
              disabled={dashboard.page + 1 >= (dashboard.logs?.totalPages ?? 1)}
            >
              Siguiente →
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-mark">Proxy Pat</p>
        <div className="footer-row">
          <nav className="footer-links" aria-label="Repositorios">
            <a href="https://github.com/NicoalsD/proxy-pat-backend">Backend · Java</a>
            <a href="https://github.com/NicoalsD/proxy-pat-frontend">Frontend · React</a>
          </nav>
          <p className="footer-note">Taller de patrones · Bogotá, 2026</p>
        </div>
      </footer>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
