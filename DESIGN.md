# Design

## Mundo visual

Editorial monocromo, tomado de una referencia de moda aportada por el cliente:
papel hueso, tinta casi negra, tipografía grotesca a gran escala, bandas negras
llenas, reglas finas, cero adornos. El peso lo lleva la escala tipográfica y el
contraste papel/tinta, no el color.

La pantalla es **Operate**: se escanea, no se lee. La expresividad vive en la
portada (cifra monumento, banda negra); el área de trabajo es plana, alineada y
silenciosa.

## Tokens

| Rol | Valor |
| --- | --- |
| Papel | `#E9E7E1` |
| Superficie | `#F2F1EC` |
| Tinta | `#141412` |
| Tinta 70 / 55 | `#4E4B45` / `#615E58` |
| Regla | `#DBD8D1` |
| Negro de banda | `#12120F` |
| Regla sobre negro | `#35342F` |
| Señal (error) | `#A8231B` |
| Señal sobre negro | `#E4776B` |

Una sola tinta de color en toda la pantalla: el rojo óxido. Marca error, umbral
superado y puntos de fallo en la gráfica. Nunca decora.

## Tipografía

- **Switzer** 400/500/600 (Fontshare). Titulares con tracking `-0.035em` a
  `-0.04em`; cuerpo 15/1.55; etiquetas 11–12 px en caja baja.
- **Geist Mono** 400/500 solo para cifras, IDs y JSON de los registros. En un
  tablero de logs la monoespaciada es el dato, no un adorno; va con
  `font-variant-numeric: tabular-nums`.
- El wordmark conserva el tracking ancho `.3em` de la referencia.

## Composición

1. Barra negra de contexto (taller, servicios, umbral).
2. Cabecera: navegación, wordmark centrado, estado en vivo y acción primaria.
3. Portada: titular a la izquierda, cifra monumento a la derecha, hallazgo bajo
   una regla.
4. Banda negra: tres servicios con tira de las últimas 20 llamadas, tres cifras
   y enlace a sus registros.
5. Latencia: gráfica de tres series + columna de p50/p95/error/pico.
6. Registros: filtros, tabla y detalle expandible.
7. Pie negro con wordmark y repositorios.

Radio 0 en todo. Sin sombras. Sin gradientes. Superficies separadas por un paso
de tono o una regla de 1 px. Números alineados a la derecha con cifras
tabuladas.

## Desviaciones deliberadas del app-sheet

- **Sin sidebar**: la referencia fija una cabecera con wordmark centrado y
  navegación plana; el contenido ocupa el ancho completo.
- **Titular de 44 px y cifra de 128 px**: la escala editorial es el brief. El
  resto de la pantalla se mantiene en la disciplina de app (superficies planas,
  color solo en datos, reglas finas).
- **Monoespaciada en cifras**: decisión de ledger; en el resto del texto, nunca.

## Estados

- Vacío: "Sin registros con estos filtros" + sugerencia de simular carga.
- Error de red: banda lateral roja con reintento, sin bloquear la lectura.
- Cargando: la acción primaria muestra "Simulando…" y se deshabilita.
- Servicio sin tráfico: "Sin llamadas" y tira vacía.

## Movimiento

Entrada de portada por opacidad y 14 px de desplazamiento, una sola vez; pulso
del punto "en vivo"; destello de 700 ms en la fila recién llegada; respuesta de
hover/press en controles. Todo con `prefers-reduced-motion`.
