# Configuración de Variables de Entorno (Frontend - Buni)

Este archivo describe las variables de entorno necesarias para que la aplicación frontend funcione correctamente.

## Archivo de configuración
Debes crear un archivo llamado `.env.local` en la raíz de la carpeta `Buni/`.

## Variables Requeridas

### 1. `NEXT_PUBLIC_API_URL`
- **Descripción**: La URL base del servidor backend (API REST).
- **Ejemplo**: `http://localhost:4000`
- **Uso**: Se utiliza en todas las peticiones `fetch` realizadas desde los componentes del cliente.

### 2. `NEXT_PUBLIC_WEBSOCKET_URL`
- **Descripción**: La URL del servidor de WebSockets para actualizaciones en tiempo real.
- **Ejemplo**: `ws://localhost:4000`
- **Uso**: Utilizada por el `SocketProvider` para establecer la conexión con el servidor de sockets.

---

## Notas Importantes
- Todas las variables en este proyecto de Next.js deben comenzar con el prefijo `NEXT_PUBLIC_` para que puedan ser accesibles desde el navegador (lado del cliente).
- Si cambias el puerto del backend, asegúrate de actualizar ambas variables aquí.
