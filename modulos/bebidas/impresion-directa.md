# Impresión directa | Sistema Solanas

Esta guía deja preparado el camino para imprimir sin ventana de confirmación cuando la Epson TM-T20II ya tenga drivers instalados.

## Estado actual

- La app ya no abre una ventana emergente aparte para imprimir.
- El ticket se genera en segundo plano.
- Si el navegador se abre en modo normal, seguirá mostrando el cuadro de impresión.
- Si el navegador se abre con `--kiosk-printing`, puede imprimir sin diálogo a la impresora predeterminada.

## Acceso actual

Usar:

- `abrir-solanas.cmd`

El acceso principal abre el servidor local del sistema. Si en el futuro se necesita impresión silenciosa real, se puede preparar un acceso específico para Chrome con `--kiosk-printing`.

## Para que funcione de verdad

1. Instalar los drivers de la Epson TM-T20II.
2. Probar desde Windows que la impresora imprime correctamente.
3. Dejar la Epson como impresora predeterminada.
4. Abrir el sistema con `abrir-solanas.cmd`.
5. Probar desde el botón `Imprimir ticket`.

## Importante

- En modo silencioso, el navegador manda a imprimir en la impresora predeterminada.
- Si la impresora predeterminada no es la Epson, el ticket puede salir por otra impresora.
- Si el navegador ignora `--kiosk-printing`, la alternativa profesional es usar un puente nativo de impresión.

## Camino más robusto a futuro

Si quieres una impresión realmente industrial y controlada, el siguiente salto sería integrar una de estas opciones:

- un puente local tipo QZ Tray
- impresión ESC/POS directa
- integracion Epson/OPOS según el driver que termine quedando instalado

Con eso ya no dependeríamos del mecanismo de impresión del navegador, y podríamos controlar mejor el tamaño del papel, el corte y el dispositivo exacto.
