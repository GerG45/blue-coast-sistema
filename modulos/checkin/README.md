# Solanas Reservas y Registro de Hu&eacute;spedes

Aplicaci&oacute;n local para recepci&oacute;n y reservas del hotel.

## Qu&eacute; hace hoy

- Panel general con historial, mapa de habitaciones, l&iacute;nea del tiempo, configuraciones y respaldo.
- Men&uacute; flotante con accesos r&aacute;pidos, igual al del comandero de bebidas.
- Carga de reservas particulares con ingreso, egreso, habitaci&oacute;n, titular, hu&eacute;spedes y pagos.
- Carga de grupos por empresa o contingente, con color propio, selecci&oacute;n de varias habitaciones y tarifas pre acordadas.
- Total pactado de grupos calculado por habitaciones, plazas facturadas, noches y tarifa especial.
- Mapa visual de 32 habitaciones con capacidad base, cama extra excepcional y mantenimiento individual.
- L&iacute;nea del tiempo con colores por reserva o grupo, ingresos y egresos en medio cuadrado.
- Lector emergente de DNI argentinos, con modo individual y escaneo m&uacute;ltiple.
- Tarifario de reservas particulares editable.
- Colores autom&aacute;ticos y editables para reservas particulares.
- Confirmaci&oacute;n final de reservas con validaciones.
- Impresi&oacute;n del formulario legal y constancia de reglas del hotel.
- Respaldo e importaci&oacute;n local mediante archivos JSON.

## C&oacute;mo usarla

1. Abrir `abrir-solanas.cmd`.
2. Entrar a `Check-in y reservas` desde el menu general.
3. Desde el panel general, pulsar `Cargar nueva reserva` o `Carga de grupo`.
4. Completar fechas, habitaciones y datos necesarios.
5. Cargar hu&eacute;spedes con el lector emergente o manualmente.
6. Revisar tarifas, total pactado o pagos seg&uacute;n corresponda.
7. Confirmar la reserva.
8. Imprimir el formulario legal cuando sea d&iacute;a de ingreso.

## Notas

- La app guarda el estado en `localStorage`.
- El d&iacute;a de egreso no cuenta para el resumen de comidas.
- Las palabras `Single` y `Twin` se mantienen por criterio operativo del hotel.
