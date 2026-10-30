# Proxy Pat · Frontend

Dashboard del proxy: salud de inventario, pedidos y pagos, latencia de las
últimas 20 llamadas y registro en vivo con filtros y detalle.

React 19 · TypeScript · Vite · Recharts · CSS propio (sin framework de estilos).

## Correr

```bash
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8080
npm run dev
```

Build de producción:

```bash
npm run build && npm run preview
```

## Configuración

| Variable | Default | Uso |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8080` | base del backend; se inyecta en build |

En Vercel se define como variable de entorno del proyecto antes de desplegar.

## Pantalla

- **Portada**: total de llamadas y el hallazgo del momento (servicio con más
  error), con el umbral del 15 %.
- **Servicios** (banda negra): llamadas, tasa de éxito, media y tira de las
  últimas 20 llamadas; rojo cuando el error supera el 15 %.
- **Latencia**: tres series con las últimas 20 llamadas, puntos rojos en las que
  fallaron, y p50/p95/error/pico.
- **Registros**: polling cada 3 s, filtros por servicio, estado y rango de
  fechas, paginación y detalle expandible con parámetros y respuesta completa.
- **Simular carga**: dispara `POST /api/metrics/simulate-load` y refresca.

## Diseño

Dirección editorial monocroma: papel hueso, tinta casi negra, grotesca a gran
escala, bandas negras y reglas finas. Una sola tinta de color, el rojo óxido,
reservada al error. Detalle completo en [DESIGN.md](./DESIGN.md) y contexto de
producto en [PRODUCT.md](./PRODUCT.md).

Tipografías: Switzer (Fontshare) y Spline Sans Mono (Google Fonts). Cifras con
`tabular-nums`.

## Estructura

```
src/
  api.ts               fetch al backend + tipos de respuesta
  useDashboard.ts      polling de 3 s, filtros, paginación, simulación
  format.ts            números, porcentajes, fechas en es-CO
  components/
    ServiceBlock.tsx   tarjeta de la banda negra
    LatencyChart.tsx   Recharts + leyenda y puntos de error
    Stats.tsx          p50/p95/error/pico
    Filters.tsx        servicio, estado, rango de fechas
    LogsTable.tsx      tabla + detalle expandible
```
