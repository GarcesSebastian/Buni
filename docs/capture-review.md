# Revisión de capturas — Buni

Revisión de **cobertura** y **calidad** del conjunto de capturas de la UI de Buni
descrito en `docs/capture-manifest.md`. Tarea de solo-capturas: no hay diff de código
que revisar, por lo que no se exigen cambios de código.

## Método de verificación

- Se listaron los PNG presentes en `Buni/docs/` (26 archivos, `01-*` a `26-*`).
- Se leyeron las **dimensiones reales** de cada PNG directamente de la cabecera IHDR
  (bytes 16-19 = ancho, 20-23 = alto, big-endian), sin fiarse del manifiesto.
  Verificación cruzada contra el primer archivo: hex `00 00 06 40` = 1600,
  `00 00 04 B0` = 1200.
- Se inspeccionaron visualmente las capturas de las 5 funciones obligatorias y varios
  controles de calidad de las imágenes de menor tamaño para descartar pantallas vacías.
- No se reejecutó la captura ni el stack.

## Verificación de dimensiones — TODAS 1600x1200

Las 26 imágenes miden **exactamente 1600x1200 px** (lectura directa de cabecera):

| Archivo | Dim. | Archivo | Dim. |
|---|---|---|---|
| 01-login.png | 1600x1200 | 14-llenado-formulario-adicional.png | 1600x1200 |
| 02-dashboard.png | 1600x1200 | 15-llenado-formulario-revision.png | 1600x1200 |
| 03-eventos.png | 1600x1200 | 16-roles-matriz-permisos.png | 1600x1200 |
| 04-detalle-evento-resumen.png | 1600x1200 | 17-roles-ver-permisos.png | 1600x1200 |
| 05-formularios.png | 1600x1200 | 18-constructor-formularios.png | 1600x1200 |
| 06-usuarios.png | 1600x1200 | 19-constructor-tipos-campo.png | 1600x1200 |
| 07-roles.png | 1600x1200 | 20-qr-evento.png | 1600x1200 |
| 08-programas.png | 1600x1200 | 21-crear-evento.png | 1600x1200 |
| 09-escenarios.png | 1600x1200 | 22-config-ventana-formulario.png | 1600x1200 |
| 10-evento-asistencias.png | 1600x1200 | 23-formulario-asistencia-publico.png | 1600x1200 |
| 11-evento-inscripciones.png | 1600x1200 | 24-formulario-cuenta-regresiva.png | 1600x1200 |
| 12-llenado-formulario-personal.png | 1600x1200 | 25-vista-movil-dashboard.png | 1600x1200 |
| 13-llenado-formulario-academico.png | 1600x1200 | 26-vista-movil-formulario.png | 1600x1200 |

Ningún PNG falla la dimensión exigida.

## Funciones obligatorias (las 5 reportadas como omitidas) — TODAS cubiertas y pobladas

1. **Llenado de formularios campo por campo** — `12-llenado-formulario-personal.png`
   (verificada visualmente): formulario público de la Jornada de Innovación 2026 con
   Nombre, Correo, Teléfono y Documento rellenados con datos reales, barra de progreso
   57%, pestañas Personal/Académica/Adicional. Refuerzan 13, 14, 15, 23.
2. **Estadísticas de eventos con gráficos recharts** — `10-evento-asistencias.png` y
   `11-evento-inscripciones.png` (verificadas): gráficos recharts de pastel + barras
   ("Distribución por Campo", género/programa) con porcentajes reales. Refuerzan 02, 04.
3. **Inscripción Y asistencia (ambos flujos)** — `11-evento-inscripciones.png`
   (lista 1-5 de 78) y `10-evento-asistencias.png` (lista 1-5 de 50), ambas verificadas,
   con Importar/Exportar Excel. Formularios públicos en 23 (asistencia) y 12-15
   (inscripción).
4. **Constructor de formularios dinámicos** — `18-constructor-formularios.png`
   (verificada): editor con campos arrastrables (@dnd-kit) agrupados en Datos
   Personales/Académicos, tipos por campo y acciones editar/eliminar; lista de 12+
   formularios con su conteo de campos. `19-constructor-tipos-campo.png` (verificada):
   diálogo "Agregar Nuevo Campo" con el desplegable de Tipo de Campo abierto mostrando
   texto, número, email, fecha, hora, selección, casilla, calificación y listas
   simples/múltiples/cuadrícula.
5. **Roles y permisos (matriz por recurso/acción)** — `16-roles-matriz-permisos.png`
   (verificada): diálogo "Crear Nuevo Rol" con matriz granular por módulo (Eventos,
   Usuarios, Roles, Programas, Escenarios, Formularios) y acción (Crear/Editar/Eliminar/
   Ver) con toggles seleccionados. Complementan `07-roles.png` (gestión de roles
   Asistente/Coordinador, verificada) y `17-roles-ver-permisos.png`.

## Cobertura amplia del resto de la app

26 capturas cubren bastante más que lo mínimo: dashboard (02), lista de eventos (03),
detalle de evento con pestaña Resumen (04), creación de evento (21), configuración de
ventanas de formulario (22), formularios (05), usuarios (06), programas (08),
escenarios (09), código QR de inscripción (20), exportación/importación a Excel
(visible en 10/11), páginas públicas de inscripción (12-15) y asistencia (23), estado
de cuenta regresiva (24) y vistas móviles responsive (25, 26). Cobertura considerada
holgada (docena larga).

## Control de pantallas vacías

- Las capturas obligatorias inspeccionadas muestran datos sembrados reales, sin pantallas
  en blanco ni estados de error.
- `24-formulario-cuenta-regresiva.png` (el PNG más pequeño, ~42 KB) se verificó
  visualmente: NO está vacío; es un estado funcional legítimo ("El evento comenzará en:
  4 Días 14 Horas 6 Minutos 48 Segundos", fecha/hora de inicio), coherente con su rol en
  el manifiesto.
- `07-roles.png` (~56 KB) verificado: tabla poblada con los roles Asistente y Coordinador.

## Notas no bloqueantes

- Los textos de algunas columnas/etiquetas de gráficos aparecen recortados por el borde
  del viewport (p. ej. "Administracion de…" en 10, columna "Programa" cortada en 11).
  Es cosmético, los datos son legibles; no bloquea.

## Conclusión

Las 5 funciones obligatorias están cubiertas con capturas reales y pobladas; las 26
imágenes miden exactamente 1600x1200; no hay pantallas vacías donde debería haber datos;
la cobertura global es amplia. **Veredicto: APPROVED.** Sin blockers.
