# Solanas App

Primera versión local del comandero para bebidas de Solanas.

## Que incluye

- 32 habitaciones fijas.
- Catálogo editable con precio de venta, costo y stock.
- Productos fijos e insumos de receta.
- Bebidas elaboradas con recetario y costo estimado automático.
- Caja directa para consumos cobrados sin habitación.
- Consumos del personal.
- Cierre de habitación y cierre global.
- Ticket imprimible con el logo actual.
- Snapshots automáticos y respaldo JSON.

## Como usarla

1. Abrir `index.html` en el navegador.
2. Trabajar el turno desde la sección de habitaciones.
3. Editar precios, costos, stock y recetas desde el catálogo.
4. Exportar un respaldo JSON cuando quieras guardar una copia externa.
5. Para preparar impresión sin diálogo, revisar `impresion-directa.md`.

## Notas

- La app guarda su estado en el navegador usando `localStorage`.
- Los productos archivados no se borran: quedan fuera del flujo normal pero siguen en el historial.
- El cierre global se bloquea si hay habitaciones con consumos pendientes, para evitar pérdidas accidentales.
- Para un insumo que no se vende directo, conviene marcarlo como `Solo insumo`.
- Para un trago o bebida armada, usar `Elaborada`: el stock se descuenta desde la receta y el costo se calcula automáticamente.
