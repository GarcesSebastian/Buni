# Buni

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://example.com/build)
[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://example.com/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Buni es una aplicación web integral diseñada para la gestión eficiente de eventos, usuarios, formularios y programas. Construida con un stack tecnológico moderno que incluye Next.js, React, TypeScript y Tailwind CSS, Buni ofrece una experiencia de usuario reactiva y en tiempo real, diseñada para optimizar los flujos de trabajo organizacionales.

## Tabla de Contenidos

*   [Acerca del Proyecto](#acerca-del-proyecto)
*   [Características Clave](#características-clave)
*   [Stack Tecnológico](#stack-tecnológico)
*   [Empezando](#empezando)
    *   [Prerrequisitos](#prerrequisitos)
    *   [Instalación](#instalación)
    *   [Ejecutando el Servidor de Desarrollo](#ejecutando-el-servidor-de-desarrollo)
*   [Contribuyendo](#contribuyendo)
*   [Licencia](#licencia)

## Acerca del Proyecto

Buni tiene como objetivo proporcionar una plataforma robusta e intuitiva para gestionar diversas actividades organizacionales. Su objetivo principal es simplificar tareas administrativas complejas y mejorar la colaboración. Buni centraliza la coordinación de eventos, la gestión de datos de usuarios, la creación de formularios dinámicos y la administración de programas en una interfaz única y fácil de usar.

Problemas clave que Buni resuelve incluyen:
*   **Información Descentralizada**: Consolida detalles de eventos, listas de participantes e información de programas, reduciendo la dispersión de datos.
*   **Procesos Manuales**: Automatiza tareas como el registro, el seguimiento de asistencia y la comunicación.
*   **Supervisión Limitada**: Ofrece a los administradores una visibilidad clara de las actividades en curso y la participación de los usuarios.
*   **Experiencia de Usuario Deficiente**: Proporciona una interfaz moderna, responsiva y en tiempo real tanto para administradores como para usuarios finales.

Un aspecto clave de Buni es su capacidad de actualización en tiempo real, asegurando que los usuarios siempre tengan la información más actual sin necesidad de refrescar manualmente. Esto es crucial para la gestión de eventos en vivo y entornos colaborativos.

## Características Clave

*   **Autenticación de Usuarios**:
    *   Sistema de inicio de sesión seguro mediante credenciales (correo electrónico y contraseña).
    *   Control de acceso basado en roles para proteger los datos y funcionalidades de la aplicación.
*   **Panel de Control (Dashboard)**:
    *   Un centro neurálgico que presenta métricas clave y una visión general de las actividades en curso.
    *   Visualiza datos como tasas de asistencia a eventos, tendencias de envío de formularios y recuentos de usuarios activos a través de gráficos y resúmenes (p. ej., usando Recharts).
*   **Gestión de Eventos**:
    *   Herramientas completas para crear, ver, actualizar y gestionar eventos.
    *   Definir detalles del evento como título, descripción, fecha, hora, ubicación (virtual o física) y capacidad.
    *   Gestionar inscripciones en línea y rastrear la asistencia ("asistencias") e inscripciones en tiempo real.
    *   Potencial para enviar recordatorios o notificaciones automáticas a los participantes.
*   **Gestión de Formularios**:
    *   Sistema flexible para crear, personalizar y gestionar formularios dinámicos.
    *   Diseñar formularios con varios tipos de campos (p. ej., entrada de texto, preguntas de opción múltiple, casillas de verificación, menús desplegables).
    *   Vincular formularios a eventos para procesos de registro fluidos o para la recopilación de comentarios post-evento.
    *   Ver, gestionar y exportar envíos de formularios (p. ej., a Excel usando `exceljs`).
*   **Gestión de Programas**:
    *   Funcionalidad para definir, estructurar y supervisar programas o cursos.
    *   Esquematizar módulos de programa, horarios y contenido.
    *   Inscribir usuarios en programas y rastrear su progreso o estado de finalización.
    *   Gestionar recursos o materiales específicos del programa.
*   **Gestión de Usuarios**:
    *   Herramientas para que los administradores gestionen eficazmente las cuentas de usuario.
    *   Definir y asignar roles de usuario (p. ej., SuperAdmin, Admin, Gestor de Eventos, Usuario Regular) con permisos específicos.
    *   Crear, ver, actualizar y eliminar perfiles de usuario.
    *   Capacidades para importación/exportación masiva de usuarios (potencialmente aprovechando `xlsx`).
*   **Actualizaciones en Tiempo Real**:
    *   Aprovecha WebSockets (Socket.IO) para proporcionar sincronización inmediata de datos en toda la aplicación.
    *   Asegura actualizaciones en vivo del estado de eventos, nuevas inscripciones, envíos de formularios e interacciones de usuarios sin necesidad de recargar la página.

## Stack Tecnológico

Buni está construido con un conjunto moderno y potente de tecnologías:

*   **Frontend**:
    *   [Next.js](https://nextjs.org/): Un framework de React para aplicaciones renderizadas en el servidor.
    *   [React](https://reactjs.org/): Una biblioteca de JavaScript para construir interfaces de usuario.
    *   [TypeScript](https://www.typescriptlang.org/): Un superconjunto tipado de JavaScript que mejora la calidad y mantenibilidad del código.
    *   [Tailwind CSS](https://tailwindcss.com/): Un framework CSS utility-first para un desarrollo rápido de UI.
*   **Comunicación en Tiempo Real**:
    *   [Socket.IO](https://socket.io/): Permite comunicación bidireccional basada en eventos en tiempo real.
*   **Librerías Clave**:
    *   `exceljs` & `xlsx`: Para funcionalidades de importación/exportación de datos de Excel.
    *   `recharts`: Para crear gráficos y visualizar datos, probablemente utilizado en el panel de control.
    *   `lucide-react`: Para iconos.
    *   `@radix-ui/*`: Para componentes de UI accesibles.

## Empezando

Para obtener una copia local y ponerla en funcionamiento, sigue estos sencillos pasos.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
*   Node.js (v18.x o posterior recomendado)
*   npm (generalmente viene con Node.js) o yarn

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/GarcesSebastian/Buni
    # Reemplaza con la URL real del repositorio
    cd Buni
    ```
2.  **Instala los paquetes NPM:**
    ```bash
    npm install
    ```
    O si prefieres yarn:
    ```bash
    yarn install
    ```

### Ejecutando el Servidor de Desarrollo

Una vez instaladas las dependencias, puedes iniciar el servidor de desarrollo:

#### Iniciar el Servidor

```bash
npm run dev
```

Esto iniciará la aplicación en `http://localhost:3000` por defecto.

## Contribuyendo

Las contribuciones son lo que hacen de la comunidad de código abierto un lugar tan increíble para aprender, inspirar y crear. Cualquier contribución que hagas es muy apreciada.

Si tienes alguna sugerencia para mejorar esto, por favor haz un fork del repositorio y crea un pull request. También puedes simplemente abrir un issue con la etiqueta "enhancement" (mejora).

¡No olvides darle una estrella al proyecto! ¡Gracias de nuevo!

### Pasos para Contribuir

1.  **Haz Fork del Proyecto**
2.  **Crea tu Rama de Característica** (`git checkout -b feature/AmazingFeature`)
3.  **Confirma tus Cambios** (`git commit -m 'Add some AmazingFeature'`)
4.  **Empuja a la Rama** (`git push origin feature/AmazingFeature`)
5.  **Abre un Pull Request**

## Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE.txt` para más información. (Nota: Es posible que necesites crear un archivo LICENSE.txt si no existe).