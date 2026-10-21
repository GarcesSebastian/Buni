# Variables de entorno — Buni (frontend Next.js)

El frontend distingue entre variables de **build/navegador** (`NEXT_PUBLIC_*`) y
una variable de **runtime/servidor** (`INTERNAL_API_URL`). Entender la diferencia
es clave para que el login funcione en Docker y en producción tras un proxy.

## Variables `NEXT_PUBLIC_*` (build-time, navegador)

Se incrustan en el bundle del cliente durante `next build`. Cambiar su valor
exige reconstruir. En Docker se pasan como `build.args` del servicio `web`.

| Variable | Uso | Valor típico (local) |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de la API que usa el **navegador** (`src/lib/api/client.ts`, `src/hooks/auth/useAuth.tsx`). | `http://localhost:4000` |
| `NEXT_PUBLIC_WEBSOCKET_URL` | URL de Socket.IO (`src/hooks/server/useSocket.tsx`). Si se omite, cae a `NEXT_PUBLIC_API_URL`. | `http://localhost:4000` |

## Variable `INTERNAL_API_URL` (runtime, servidor)

- **Qué es:** la URL base que usa el **código de servidor** de Next para llamar
  a la API: `src/middleware.ts` (verificación de sesión en cada navegación
  protegida) y las llamadas `apiFetch` que se ejecutan en el servidor (p. ej. la
  rama pública `/forms/*` del middleware, que invoca `getEvents()`).
- **Cuándo se lee:** en **tiempo de ejecución**, no en build. No es `NEXT_PUBLIC_*`
  y nunca se incrusta en el bundle del cliente. Por eso se define en el bloque
  `environment:` del servicio `web` (no en `build.args`).
- **Fallback:** si no se define, el resolver (`src/lib/serverApiBase.ts`) cae a
  `NEXT_PUBLIC_API_URL`.

### Por qué existe

El navegador y el servidor Next ven la API en direcciones distintas. El navegador
usa la URL publicada hacia el host (`http://localhost:4000`); el servidor Next,
dentro del contenedor `web`, no puede alcanzar la API por ese `localhost` (ahí no
escucha nada) y debe usar el nombre interno del servicio Docker
(`http://api:4000`). Si el middleware usara la URL del navegador, la verificación
de token fallaría en el servidor y un usuario recién autenticado sería redirigido
de vuelta a `/` (el bug de login que esta variable corrige).

### Cómo configurarla

- **Docker (`api-buni/compose.dev.yml`):** ya viene definida en el servicio `web`:

  ```yaml
  web:
    environment:
      INTERNAL_API_URL: http://api:4000
  ```

- **Bare-metal (sin Docker):** puede omitirse; `localhost` resuelve igual para el
  navegador y para el servidor Next, así que el fallback a `NEXT_PUBLIC_API_URL`
  es suficiente.
- **Producción tras un reverse proxy:** el middleware debe alcanzar la API por una
  URL **resoluble internamente** (nombre de servicio, DNS interno o host:puerto
  del backend), no necesariamente la URL pública del navegador. Define
  `INTERNAL_API_URL` con esa URL interna.
