import { SERVICES } from "../format";
import type { Filters as FiltersShape } from "../types";

interface Props {
  filters: FiltersShape;
  total: number;
  onChange: (key: keyof FiltersShape, value: string) => void;
  onClear: () => void;
}

export function Filters({ filters, total, onChange, onClear }: Props) {
  const dirty =
    filters.service !== "" || filters.status !== "" || filters.from !== "" || filters.to !== "";

  return (
    <div className="filters">
      <label className="field">
        <span>Servicio</span>
        <select value={filters.service} onChange={(event) => onChange("service", event.target.value)}>
          <option value="">Todos</option>
          {SERVICES.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Estado</span>
        <select value={filters.status} onChange={(event) => onChange("status", event.target.value)}>
          <option value="">Todos</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="ERROR">ERROR</option>
        </select>
      </label>

      <label className="field">
        <span>Desde</span>
        <input
          type="datetime-local"
          value={filters.from}
          onChange={(event) => onChange("from", event.target.value)}
        />
      </label>

      <label className="field">
        <span>Hasta</span>
        <input
          type="datetime-local"
          value={filters.to}
          onChange={(event) => onChange("to", event.target.value)}
        />
      </label>

      <div className="filters-tail">
        <span className="filters-total">
          {total.toLocaleString("es-CO")} {total === 1 ? "registro" : "registros"}
        </span>
        {dirty && (
          <button type="button" className="text-button" onClick={onClear}>
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
