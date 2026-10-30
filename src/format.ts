const integer = new Intl.NumberFormat("es-CO");
const decimal = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });

export const SERVICES = [
  { id: "inventory", label: "Inventario" },
  { id: "orders", label: "Pedidos" },
  { id: "payments", label: "Pagos" },
] as const;

export const serviceLabel = (id: string) =>
  SERVICES.find((service) => service.id === id)?.label ?? id;

export const count = (value: number) => integer.format(value);

export const percent = (rate: number) => `${decimal.format(rate * 100)} %`;

export const millis = (value: number) => `${decimal.format(value)} ms`;

export const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("es-CO", { hour12: false });

export const dayTime = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "medium" });
