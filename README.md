<p align="center">
  <img src="./public/logo.png" alt="Buni" width="160" />
</p>

<h1 align="center">Buni</h1>

<p align="center">Gestión integral de eventos: inscripciones, asistencias, formularios dinámicos y estadísticas en tiempo real, desde el navegador.</p>

<p align="center">
  <a href="https://example.com/build"><img src="https://img.shields.io/badge/build-passing-brightgreen" alt="Build Status" /></a>
  <a href="https://example.com/releases"><img src="https://img.shields.io/badge/version-0.1.0-blue" alt="Version" /></a>
  <a href="LICENSE.txt"><img src="https://img.shields.io/badge/license-GPL--3.0-green" alt="License: GPL-3.0" /></a>
</p>

---

Buni es la plataforma con la que un área de Bienestar Universitario (o cualquier organización que haga eventos) coordina todo de principio a fin: crea el evento, arma sus formularios de inscripción y de asistencia campo por campo, abre el registro al público, controla quién asiste con un código QR, y sigue en vivo cuántas personas se inscribieron, cuántas llegaron y cómo se reparten por programa o por género. Todo se actualiza solo entre quienes están conectados, y lo que se recoge se exporta a Excel cuando hace falta.

<p align="center">
  <img src="./docs/02-dashboard.png" alt="Panel de control de Buni con las métricas de eventos, inscripciones y asistencias, el listado de eventos recientes, el registro de actividad y los gráficos de participación" width="760" />
</p>

## Contenido

- [Para quién es](#para-quién-es)
- [Qué puedes hacer](#qué-puedes-hacer)
  - [Acceso y control por roles](#acceso-y-control-por-roles)
  - [Panel de control con estadísticas](#panel-de-control-con-estadísticas)
  - [Gestión de eventos](#gestión-de-eventos)
  - [Estadísticas de inscripciones y asistencias](#estadísticas-de-inscripciones-y-asistencias)
  - [Llenado de formularios: inscripción](#llenado-de-formularios-inscripción)
  - [Llenado de formularios: asistencia](#llenado-de-formularios-asistencia)
  - [Ventanas de disponibilidad y cuenta regresiva](#ventanas-de-disponibilidad-y-cuenta-regresiva)
  - [Constructor de formularios dinámicos](#constructor-de-formularios-dinámicos)
  - [Tipos de campo y configuración](#tipos-de-campo-y-configuración)
  - [Roles y permisos granulares](#roles-y-permisos-granulares)
  - [Usuarios](#usuarios)
  - [Programas y escenarios](#programas-y-escenarios)
  - [Código QR por evento](#código-qr-por-evento)
  - [Crear un evento](#crear-un-evento)
  - [Exportación a Excel y tiempo real](#exportación-a-excel-y-tiempo-real)
  - [Vista responsive (móvil)](#vista-responsive-móvil)
- [Cómo está hecho](#cómo-está-hecho)
- [Documentación técnica](#documentación-técnica)
- [Autor](#autor)
- [Licencia](#licencia)

## Para quién es

- Áreas de Bienestar Universitario que organizan ferias, jornadas y talleres con muchos participantes.
- Coordinaciones de programas y facultades que necesitan inscribir gente y controlar asistencia.
- Equipos que arman formularios distintos para cada evento sin depender de un desarrollador.
- Quien necesita medir participación en vivo y exportar los datos recogidos a Excel.
- Administradores que reparten qué puede hacer cada persona con un sistema de roles y permisos.

## Qué puedes hacer

<table>
<tr>
<td width="50%" valign="top">

### Acceso y control por roles

<img src="./docs/01-login.png" alt="Pantalla de inicio de sesión de Buni con el logo de Bienestar Universitario, los campos de correo y contraseña y el botón Iniciar sesión" width="100%" />

Entra con correo y contraseña. A partir de ahí, el control de acceso por roles decide qué pantallas y acciones ve cada persona, de modo que un coordinador y un asistente no manejan lo mismo.

</td>
<td width="50%" valign="top">

### Panel de control con estadísticas

<img src="./docs/02-dashboard.png" alt="Dashboard con tarjetas de total de eventos, inscripciones, asistencias y tasa de asistencia, eventos recientes, registro de actividad y gráficos de participación" width="100%" />

El primer vistazo lo da todo: total de eventos, inscripciones y asistencias, tasa de asistencia, los eventos recientes, el registro de actividad del sistema y un gráfico de participación hecho con Recharts.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">

### Gestión de eventos

<img src="./docs/03-eventos.png" alt="Listado de eventos en una tabla con nombre, organizador, cupos, horarios, programa, escenario y formularios asociados" width="100%" />

Todos los eventos en una tabla filtrable: nombre, organizador, cupos, horarios, programa, escenario y los formularios de inscripción y asistencia asociados a cada uno.

</td>
<td width="50%" valign="top">

### Detalle y resumen del evento

<img src="./docs/04-detalle-evento-resumen.png" alt="Detalle de la Feria de Emprendimiento con información general y estadísticas de inscripciones, asistencias y tasa de asistencia" width="100%" />

Al abrir un evento ves su información general y el resumen de participación en vivo: inscripciones recibidas, asistencias confirmadas y la tasa de asistencia calculada entre ambas.

</td>
</tr>
</table>

### Estadísticas de inscripciones y asistencias

Cada evento lleva sus números al día: listas paginadas de quién se inscribió y quién asistió, con gráficos Recharts (pastel y barras) que reparten a los participantes por programa, por género y por campo del formulario.

<table>
<tr>
<td width="50%" valign="top">

Asistencias

<img src="./docs/10-evento-asistencias.png" alt="Pestaña de asistencias con lista paginada, exportación a Excel y gráficos de pastel y barras de distribución" width="100%" />

Lista paginada de asistentes, botones de importar y exportar a Excel y los gráficos de distribución por campo.

</td>
<td width="50%" valign="top">

Inscripciones

<img src="./docs/11-evento-inscripciones.png" alt="Pestaña de inscripciones con lista paginada y gráficos de distribución por género y programa" width="100%" />

Lista paginada de inscritos con los datos recogidos y los gráficos de distribución por género y por programa.

</td>
</tr>
</table>

### Llenado de formularios: inscripción

El participante abre el enlace público del evento y completa el formulario de inscripción por secciones, con barra de progreso en vivo. Los campos los definió antes el organizador, así que cada evento pide exactamente lo que necesita.

<table>
<tr>
<td width="50%" valign="top">

Datos personales

<img src="./docs/12-llenado-formulario-personal.png" alt="Formulario público de inscripción con la sección Personal rellenada, cuenta regresiva y barra de progreso" width="100%" />

La sección Personal con nombre, correo, teléfono y documento, cuenta regresiva del evento y progreso al 57%.

</td>
<td width="50%" valign="top">

Datos académicos

<img src="./docs/13-llenado-formulario-academico.png" alt="Sección académica del formulario con el programa académico seleccionado en un campo de selección" width="100%" />

La sección Académica, con el programa elegido en un campo de selección poblado desde los programas de la plataforma.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">

Datos adicionales

<img src="./docs/14-llenado-formulario-adicional.png" alt="Sección adicional del formulario con el checkbox de aceptación de términos marcado y progreso al 100%" width="100%" />

La sección Adicional, con la casilla de aceptación de términos marcada y el progreso completo al 100%.

</td>
<td width="50%" valign="top">

Revisión y envío

<img src="./docs/15-llenado-formulario-revision.png" alt="Paso de revisión y envío del formulario con el botón Enviar formulario" width="100%" />

El último paso revisa lo completado por sección y deja listo el botón Enviar formulario para registrar la inscripción.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">

### Llenado de formularios: asistencia

<img src="./docs/23-formulario-asistencia-publico.png" alt="Formulario público de asistencia para control de asistencia al evento" width="100%" />

Además del de inscripción, cada evento tiene su propio formulario público de asistencia, independiente, que se rellena el día del evento para dejar registro de quién llegó.

</td>
<td width="50%" valign="top">

### Ventanas de disponibilidad y cuenta regresiva

<img src="./docs/24-formulario-cuenta-regresiva.png" alt="Pantalla de cuenta regresiva mostrando el tiempo restante para que abra el formulario" width="100%" />

Si un formulario todavía no abre su ventana de fechas, el participante ve una cuenta regresiva con los días, horas y minutos que faltan para que empiece.

</td>
</tr>
</table>

### Constructor de formularios dinámicos

El corazón de Buni: cada evento arma sus formularios a la medida, sin tocar código. Los campos se agrupan por sección, se reordenan arrastrando y soltando (`@dnd-kit`) y se editan o eliminan uno a uno.

<table>
<tr>
<td width="50%" valign="top">

Gestión de formularios

<img src="./docs/05-formularios.png" alt="Gestión de formularios con el listado de formularios disponibles, su estado y número de campos" width="100%" />

Todos los formularios reutilizables, con su estado y su número de campos (12 o más en los datos de ejemplo).

</td>
<td width="50%" valign="top">

Constructor arrastrable

<img src="./docs/18-constructor-formularios.png" alt="Constructor de formularios con los campos agrupados por sección y arrastrables para reordenar" width="100%" />

El editor con los campos agrupados en Datos Personales y Académicos, arrastrables para reordenar, con acciones de editar y eliminar por campo.

</td>
</tr>
</table>

### Tipos de campo y configuración

<table>
<tr>
<td width="50%" valign="top">

Tipos de campo

<img src="./docs/19-constructor-tipos-campo.png" alt="Diálogo de nuevo campo con el desplegable de tipos: texto, número, email, fecha, hora, selección, calificación y más" width="100%" />

Al agregar un campo eliges su tipo: texto, número, email, fecha, hora, selección, casilla, calificación, listas simples o múltiples y cuadrículas.

</td>
<td width="50%" valign="top">

Ventanas por formulario

<img src="./docs/22-config-ventana-formulario.png" alt="Diálogo para configurar los intervalos de disponibilidad de los formularios de inscripción y asistencia" width="100%" />

Configura cuándo están disponibles el formulario de inscripción y el de asistencia, cada uno con su propia ventana de fechas.

</td>
</tr>
</table>

### Roles y permisos granulares

Cada rol define, recurso por recurso y acción por acción, qué puede hacer quien lo tiene. No es "admin o no admin": es una matriz fina sobre eventos, usuarios, roles, programas, escenarios y formularios.

<table>
<tr>
<td width="50%" valign="top">

Gestión de roles

<img src="./docs/07-roles.png" alt="Gestión de roles con los roles personalizados Asistente y Coordinador" width="100%" />

Los roles personalizados (Asistente, Coordinador) con acceso a ver sus permisos.

</td>
<td width="50%" valign="top">

Matriz de permisos

<img src="./docs/16-roles-matriz-permisos.png" alt="Diálogo de creación de rol con la matriz granular de permisos por recurso y acción" width="100%" />

El diálogo de crear rol con la matriz granular: por cada recurso, los toggles de crear, editar, eliminar y ver.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">

Detalle de un rol

<img src="./docs/17-roles-ver-permisos.png" alt="Diálogo que muestra los permisos asignados a un rol, agrupados por módulo" width="100%" />

La vista de los permisos asignados a un rol, agrupados por módulo, para saber de un vistazo qué alcance tiene.

</td>
<td width="50%" valign="top">

### Usuarios

<img src="./docs/06-usuarios.png" alt="Listado de usuarios con nombre, correo y rol asignado" width="100%" />

La gestión de usuarios con su rol asignado (Coordinador o Asistente en el ejemplo), para dar de alta al equipo y repartir accesos.

</td>
</tr>
</table>

### Programas y escenarios

Los eventos no viven sueltos: se asocian a un programa o facultad y a un escenario o sede. Ambos catálogos se gestionan desde la app y alimentan los selectores al crear eventos y las estadísticas por programa.

<table>
<tr>
<td width="50%" valign="top">

Programas

<img src="./docs/08-programas.png" alt="Gestión de programas o facultades" width="100%" />

Las facultades y programas académicos que se asocian a los eventos y clasifican a los inscritos.

</td>
<td width="50%" valign="top">

Escenarios

<img src="./docs/09-escenarios.png" alt="Gestión de escenarios o sedes" width="100%" />

Las sedes y espacios donde se realizan los eventos.

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" valign="top">

### Código QR por evento

<img src="./docs/20-qr-evento.png" alt="Diálogo con el código QR de inscripción del evento y botón de descarga" width="100%" />

Cada evento genera un código QR descargable que lleva directo a su formulario, para imprimirlo o compartirlo y que la gente se inscriba o marque asistencia con el teléfono.

</td>
<td width="50%" valign="top">

### Crear un evento

<img src="./docs/21-crear-evento.png" alt="Diálogo de creación de evento con nombre, organizador, cupos, ventana de tiempo, programa, escenario y formularios" width="100%" />

El diálogo para crear un evento reúne todo: nombre, organizador, cupos (o ilimitados), ventana de tiempo de inicio y fin, programa, escenario, los formularios de inscripción y asistencia, y el estado.

</td>
</tr>
</table>

### Exportación a Excel y tiempo real

- **Exportación a Excel.** Las listas de inscripciones y asistencias se exportan (e importan) a Excel con `exceljs`, visible en las pestañas de cada evento.
- **Actualizaciones en tiempo real.** Buni usa Socket.IO para sincronizar al instante entre todas las personas conectadas: nuevas inscripciones, asistencias y cambios en los eventos aparecen sin recargar la página.

### Vista responsive (móvil)

Buni funciona igual desde el teléfono, tanto para quien administra como para quien se inscribe desde el QR.

<table>
<tr>
<td width="50%" valign="top">

Dashboard móvil

<img src="./docs/25-vista-movil-dashboard.png" alt="Vista móvil del dashboard en columna única con menú hamburguesa" width="100%" />

El panel de control en columna única, con las métricas apiladas y menú hamburguesa.

</td>
<td width="50%" valign="top">

Formulario móvil

<img src="./docs/26-vista-movil-formulario.png" alt="Vista móvil del formulario público de inscripción" width="100%" />

El formulario público adaptado a pantallas pequeñas, con la tarjeta del evento y el progreso por secciones apilados.

</td>
</tr>
</table>

## Cómo está hecho

Buni se usa desde el navegador. El frontend es una aplicación **Next.js 15** (App Router) con **React 19** y **TypeScript**, estilada con **Tailwind CSS**. Habla con el backend (`api-buni`) por REST para los datos y por **Socket.IO** para las actualizaciones en vivo. Los gráficos del dashboard y de cada evento se dibujan con **recharts**, la importación y exportación de datos usa **exceljs**, y los componentes accesibles se apoyan en **@radix-ui/\*** con iconos de **lucide-react**.

El detalle técnico (stack completo, scripts, variables de entorno y cómo levantarlo con o sin Docker) está en la sección de [Documentación técnica](#documentación-técnica) más abajo.

## Documentación técnica

- La [documentación técnica del cliente](#documentación-técnica-cliente) (al final de este README) describe el stack, los scripts de `package.json`, las variables de entorno y cómo ejecutar el frontend con y sin Docker.
- [`.env.example`](./.env.example): plantilla de variables de entorno.
- [`README_ENV.md`](./README_ENV.md): detalle de las variables y del contrato de WebSocket compartido con el backend.

## Autor

Hecho por Sebxstt ([GarcesSebastian](https://github.com/GarcesSebastian)).

## Licencia

Distribuido bajo la licencia [GPL-3.0](LICENSE.txt).

---

# Documentación técnica (cliente)

Esta sección es la referencia técnica del frontend de Buni: stack, scripts reales,
variables de entorno y cómo ejecutarlo con y sin Docker.

## Stack

- **Next.js 15** (App Router) con **React 19** y **TypeScript**.
- **Tailwind CSS 3** para los estilos.
- **@tanstack/react-query** para el estado del servidor en el cliente.
- **socket.io-client 4** para las actualizaciones en tiempo real.
- Componentes accesibles con **@radix-ui/\***; iconos con **lucide-react** y **react-icons**.
- Importación/exportación de datos con **exceljs**; gráficos con **recharts**.

El frontend habla con el backend (`api-buni`) por REST y por Socket.IO. La salida de
producción usa el modo `standalone` de Next (`next.config.ts` → `output: 'standalone'`),
que emite un servidor autónomo en `.next/standalone/server.js`.

## Scripts

Los únicos scripts definidos en `package.json` son:

| Script | Comando | Descripción |
|---|---|---|
| `npm run dev` | `next dev` | Servidor de desarrollo en `http://localhost:3000`. |
| `npm run build` | `next build` | Build de producción; genera `.next/standalone/` (salida standalone). |
| `npm run start` | `next start` | Sirve el build de producción generado por `next build`. |
| `npm run lint` | `next lint` | Linter de Next/ESLint. |

## Variables de entorno

Ambas variables son de **build** (prefijo `NEXT_PUBLIC_`): Next las incrusta en el bundle
del cliente al ejecutar `next build`, no se leen en runtime. Cambiar su valor exige
reconstruir. Los nombres coinciden exactamente con los usados en el código.

| Variable | Descripción | Uso en el código |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base de la API REST del backend. | `src/lib/api/client.ts`, `src/middleware.ts`, `src/hooks/auth/useAuth.tsx` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | URL del servidor Socket.IO. Si falta, cae a `NEXT_PUBLIC_API_URL`. | `src/hooks/server/useSocket.tsx` |

Hay una plantilla en [`.env.example`](./.env.example). Consulta también
[`README_ENV.md`](./README_ENV.md) para más detalle sobre las variables y el contrato de
WebSocket compartido.

## Ejecutar sin Docker (bare)

Requisitos: Node.js 20 y npm. El backend (`api-buni`) debe estar accesible en la URL que
indiques en `NEXT_PUBLIC_API_URL`.

```bash
# 1. Instalar dependencias
npm ci            # o: npm install

# 2. Configurar variables de build
#    Crea un archivo .env.local a partir de la plantilla
cp .env.example .env.local
#    y ajusta NEXT_PUBLIC_API_URL / NEXT_PUBLIC_WEBSOCKET_URL si hace falta.

# Desarrollo (recarga en caliente)
npm run dev       # http://localhost:3000

# Producción
npm run build
npm run start     # http://localhost:3000
```

> Como `NEXT_PUBLIC_*` se incrustan en el build, define `.env.local` **antes** de
> `npm run build`. Si cambias las URLs, vuelve a construir.

## Ejecutar con Docker

El `Dockerfile` es multi-stage con salida standalone, imagen base fijada
`node:20.19.1-alpine3.21`, usuario no-root y arranque `node server.js` en el puerto 3000.
Las variables `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_WEBSOCKET_URL` se pasan como **build
args**.

Construir la imagen directamente:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:4000 \
  --build-arg NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:4000 \
  -t buni-web .

docker run --rm -p 3000:3000 buni-web   # http://localhost:3000
```

### Stack local completo (MySQL + API + Web)

El frontend está cableado en el compose de desarrollo del backend, que levanta
MySQL 8 + API (`:4000`) + Web (`:3000`) con un solo comando. Desde la carpeta del
backend (`../api-buni`, hermana de esta):

```bash
cd ../api-buni
docker compose -f compose.dev.yml up --build
```

El servicio `web` se construye desde `../Buni` y recibe los build args
`NEXT_PUBLIC_API_URL` / `NEXT_PUBLIC_WEBSOCKET_URL` apuntando a `http://localhost:4000`.
La app queda disponible en `http://localhost:3000`.
