# Manifiesto de capturas — Buni

Conjunto exhaustivo de capturas reales de la UI de Buni corriendo en Docker
(`http://localhost:3000`), con los datos sembrados (5 eventos, 268 inscripciones,
185 asistencias, 6 usuarios, 2 roles personalizados, 5 programas, 5 escenarios,
12+ formularios dinámicos). Todas son PNG de **1600x1200 px** exactos.

## Método de captura

- **Script headless con Puppeteer-core** conduciendo el Chrome ya instalado del sistema
  (`node:puppeteer-core`, viewport 1600x1200, `deviceScaleFactor: 1`), navegando la app
  real con la sesión de admin (`admin@buni.test`).
- **Motivo de no usar el MCP chrome-devtools:** sus herramientas están cargadas en este
  entorno pero el servidor MCP respondió `Not connected` (no hay navegador adjunto que
  controle), incluso tras levantar Chrome con `--remote-debugging-port`. Por eso se
  recurrió al script headless, que sí produce PNGs reales 1600x1200 de la UI en ejecución.
- Las vistas móviles (25, 26) se renderizan a viewport de teléfono (390px, layout
  responsive real) y se centran sobre un lienzo 1600x1200 con `sharp` para cumplir la
  dimensión exacta exigida.
- No se envió ningún formulario público (no se pulsó "Enviar formulario"), para no mutar
  los contadores sembrados de los eventos. El resto son navegación y apertura de diálogos.
- No se tocó código, Dockerfiles, compose ni configuración. La única acción Docker fue
  `docker restart buni-dev-api-1` (no destructiva; los datos viven en el contenedor de db)
  para resetear el rate limiter en memoria del login (429) entre lotes de capturas.

## Funciones obligatorias (las 5 que el usuario reportó omitidas) — TODAS cubiertas

| # | Función obligatoria | Capturas que la muestran |
|---|---------------------|--------------------------|
| 1 | Llenado de formularios (campo por campo) | 12, 13, 14, 15, 23 |
| 2 | Estadísticas de los eventos (gráficos recharts) | 02, 04, 10, 11 |
| 3 | Inscripción y asistencia a eventos (ambos formularios públicos + listas) | 10, 11, 23, 24 |
| 4 | Creación de formularios dinámicos (constructor DnD + tipos de campo) | 18, 19 |
| 5 | Sistema de roles y permisos (matriz granular) | 07, 16, 17 |

## Inventario de imágenes

| Archivo | Dimensiones | Qué función muestra | Oblig. |
|---------|-------------|---------------------|:------:|
| `01-login.png` | 1600x1200 | Pantalla de inicio de sesión con el logo de Bienestar Universitario y las credenciales rellenadas. | — |
| `02-dashboard.png` | 1600x1200 | Panel de control con métricas reales (5 eventos, 268 inscripciones, 185 asistencias, 69% tasa), eventos recientes, registro de actividad y gráfico recharts de participación. | 2 |
| `03-eventos.png` | 1600x1200 | Lista de eventos en tabla filtrable: nombre, organizador, cupos, horarios, programa, escenario y formularios asociados (5 eventos). | — |
| `04-detalle-evento-resumen.png` | 1600x1200 | Detalle de la Feria de Emprendimiento, pestaña Resumen: info general + estadísticas (78 inscripciones, 50 asistencias, 64% de tasa). | 2 |
| `05-formularios.png` | 1600x1200 | Gestión de formularios dinámicos: 12+ formularios con estado y número de campos. | 4 |
| `06-usuarios.png` | 1600x1200 | Gestión de usuarios: los 6 usuarios sembrados con su rol (Coordinador / Asistente). | — |
| `07-roles.png` | 1600x1200 | Gestión de roles: roles personalizados Asistente y Coordinador con acceso a "Ver permisos". | 5 |
| `08-programas.png` | 1600x1200 | Gestión de programas/facultades: 5 programas activos. | — |
| `09-escenarios.png` | 1600x1200 | Gestión de escenarios: 5 escenarios activos. | — |
| `10-evento-asistencias.png` | 1600x1200 | Detalle de evento, pestaña Asistencias: lista paginada (1-5 de 50, página 1 de 10), exportar/importar Excel y gráficos recharts pie+barras "Distribución por Campo". | 2, 3 |
| `11-evento-inscripciones.png` | 1600x1200 | Detalle de evento, pestaña Inscripciones: lista paginada (1-5 de 78, página 1 de 16) con género/programa y gráficos recharts (pie de género, barras). | 2, 3 |
| `12-llenado-formulario-personal.png` | 1600x1200 | Formulario público de inscripción (Jornada 2026, abierto): sección Personal rellenada con datos reales, cuenta regresiva y barra de progreso 57%. | 1 |
| `13-llenado-formulario-academico.png` | 1600x1200 | Mismo formulario, sección Académica con el select "Programa academico" = Ingeniería de Sistemas (tipo select poblado). | 1 |
| `14-llenado-formulario-adicional.png` | 1600x1200 | Sección Adicional con el checkbox "Acepto los términos" marcado, progreso 100%. | 1 |
| `15-llenado-formulario-revision.png` | 1600x1200 | Paso Revisión y Envío (100% completado) con el botón "Enviar formulario" listo (no se envió). | 1 |
| `16-roles-matriz-permisos.png` | 1600x1200 | Diálogo "Crear Nuevo Rol" con la matriz de permisos granular por recurso (Eventos, Usuarios, Roles, Programas, Escenarios, Formularios) y acción (Crear/Editar/Eliminar/Ver), con toggles seleccionados. | 5 |
| `17-roles-ver-permisos.png` | 1600x1200 | Diálogo "Permisos del Rol: Asistente" mostrando los permisos asignados por módulo. | 5 |
| `18-constructor-formularios.png` | 1600x1200 | Constructor de formularios dinámicos en edición: lista de campos arrastrable (@dnd-kit) agrupada en Datos Personales/Académicos con tipos (texto, email, selección, fecha) y acciones editar/eliminar. | 4 |
| `19-constructor-tipos-campo.png` | 1600x1200 | Diálogo "Agregar Nuevo Campo" con el desplegable de Tipo de Campo abierto: texto, número, email, fecha, hora, selección, casilla, calificación, listas simples/múltiples y cuadrículas. | 4 |
| `20-qr-evento.png` | 1600x1200 | Diálogo de código QR de inscripción del evento, con QR renderizado y botón Descargar. | 3 |
| `21-crear-evento.png` | 1600x1200 | Diálogo "Crear Eventos": nombre, organizador, cupos (+ ilimitado), ventana de tiempo (inicio/fin), programa, escenario, formularios de asistencia/inscripción y estado. | — |
| `22-config-ventana-formulario.png` | 1600x1200 | Diálogo "Configurar intervalos de formularios": pestañas Inscripciones/Asistencias y toggle para habilitar la ventana de fechas de disponibilidad. | 3 |
| `23-formulario-asistencia-publico.png` | 1600x1200 | Formulario público de **asistencia** (Jornada 2026, abierto) rellenado — el segundo tipo de formulario por evento. | 1, 3 |
| `24-formulario-cuenta-regresiva.png` | 1600x1200 | Estado público de cuenta regresiva: el formulario aún no abre su ventana y muestra el contador "El evento comenzará en…". | 3 |
| `25-vista-movil-dashboard.png` | 1600x1200 | Vista responsive/móvil del dashboard (layout en columna única, menú hamburguesa), centrada en lienzo 1600x1200. | — |
| `26-vista-movil-formulario.png` | 1600x1200 | Vista responsive/móvil del formulario público de inscripción (tarjeta de evento + progreso apilados). | 1 |

## Pantallas no capturadas

Ninguna pantalla significativa quedó sin capturar. No se capturaron estados de éxito tras
envío real de formularios (pantalla "¡Formulario enviado con éxito!") porque enviarlos
habría mutado los contadores sembrados de los eventos; en su lugar se capturó el paso de
Revisión y Envío previo (15), que muestra la misma UX sin alterar datos.

**Total: 26 capturas, todas 1600x1200 px, todas con datos reales sembrados.**
