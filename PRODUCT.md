# Proxy Pat

Dashboard del taller de patrones: un proxy genérico envuelve tres microservicios
(inventario, pedidos, pagos), mide cada llamada y expone lo que ve.

## Quién lo usa

Un estudiante o el docente del taller, durante una sesión de revisión. Abre la
pantalla para responder una pregunta y se va: no es una herramienta de turnos.

## La pregunta de la pantalla

**¿Los tres servicios están sanos ahora mismo, y si no, cuál falla?**

El hallazgo (servicio con más error y su tasa) va en la primera pantalla, junto
al total de llamadas. Las tres tarjetas de servicio son la respuesta por
servicio; la tabla permite encontrar la llamada exacta.

## Trabajo principal

1. Pulsar **Simular carga** para generar 50 llamadas y poblar los registros.
2. Ver la tasa de error por servicio; sobre 15 % la tarjeta se marca en rojo.
3. Filtrar los registros por servicio, estado y rango de fechas.
4. Abrir una fila para leer los parámetros de entrada y la respuesta completa.

## Datos

- Backend en memoria: buffer circular de 5.000 registros, sin base de datos.
- Pagos falla a propósito en el 10 % de las llamadas (falla del taller).
- Cada registro: `requestId` (UUID), `serviceId`, `operation`, `durationMs`,
  `status`, `timestamp`, `params`, `result`, `error`.

## Restricciones

- El dashboard debe caber en un vistazo: sin login, sin navegación profunda.
- El diseño sigue una referencia editorial monocroma aportada por el cliente.
- Backend en Render (Docker), frontend en Vercel; CORS por variable de entorno.
