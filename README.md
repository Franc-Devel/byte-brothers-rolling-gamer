# 🎮 ROLLING GAMER | Tienda & Catálogo de Videojuegos

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![React_Router](https://img.shields.io/badge/React_Router-v8-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Status](https://img.shields.io/badge/RollingCode_School-Cohorte_9P-red)](#)

Plataforma web profesional **ROLLING GAMER**, desarrollada con **React 19**, **Vite**, **Bootstrap 5** y **React Router**. Cuenta con carrusel cinematográfico con selector lateral, catálogo de más de 20 títulos, fichas de producto con especificaciones técnicas, sistema de reseñas y panel de administración protegido.

---

## 📌 Tabla de Contenidos
1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Requerimientos Cumplidos](#-requerimientos-cumplidos)
3. [Credenciales de Acceso para Evaluación](#-credenciales-de-acceso-para-evaluación)
4. [Instalación y Ejecución Local](#-instalación-y-ejecución-local)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Equipo de Desarrollo](#-equipo-de-desarrollo)
7. [Despliegue (Netlify / Vercel)](#-despliegue-netlify--vercel)

---

## 📖 Descripción del Proyecto

ROLLING GAMER es una solución e-commerce moderna para gamers que ofrece:
- **Catálogo digital de más de 20 títulos AAA e Indies** precargados con datos reales, precios, géneros, capturas y requisitos de sistema.
- **Buscador en tiempo real** por título, desarrollador y género.
- **Filtros por categoría** (RPG, Acción, Aventura, Terror, Simulación, Deportes, Indie) y opciones de ordenamiento por precio y satisfacción.
- **Ficha técnica extendida** (`/detalle/:id`) con requisitos mínimos y recomendados de hardware (SO, Procesador, RAM, Tarjeta Gráfica y Espacio en Disco).
- **Sistema interactivo de reseñas** con cálculo dinámico en tiempo real del porcentaje de satisfacción estilo Steam (*Extremadamente Positivas*, *Mayormente Positivas*, *Mixtas*).
- **Lista de deseos personal (Wishlist)** sincronizada por usuario autenticado.
- **Panel de Control de Administración (`/admin`)** protegido con CRUD completo para crear, editar y eliminar videojuegos, además de una tabla de gestión de usuarios registrados.

---

## ✅ Requerimientos Cumplidos

| Requisito | Detalle Técnico | Estado |
| :--- | :--- | :---: |
| **Persistencia y Estado** | Catálogo de juegos, usuarios registrados, sesión activa y lista de deseos sincronizados con `LocalStorage` y `useEffect`. | ✅ |
| **Enrutamiento (React Router)** | `/` (Inicio), `/detalle/:id` (Ficha técnica), `/admin` (Panel CRUD), `/about` (Equipo), `/wishlist` (Deseos), `/login` (Acceso), `/404` (Error personalizado). | ✅ |
| **Catálogo con Filtros** | Búsqueda por nombre en vivo, filtro por categorías y selector de ordenamiento múltiple. | ✅ |
| **Detalle del Videojuego** | Nombre, precio, categoría, imagen principal, galería de capturas, descripción breve y completa, requisitos de sistema y desarrollador. | ✅ |
| **Sistema de Reseñas** | Cálculo dinámico de % de votos positivos y negativos. Los usuarios autenticados pueden votar (👍 / 👎) y redactar su opinión. | ✅ |
| **Lista de Deseos (Wishlist)** | Guardado/eliminación reactiva de juegos favoritos exclusivo para usuarios con sesión activa. | ✅ |
| **Panel CRUD de Videojuegos** | Tabla interactiva para listar, agregar (`/crear`), modificar (`/editar/:id`) y eliminar con confirmación de `SweetAlert2`. | ✅ |
| **Gestión de Usuarios** | Tabla de usuarios registrados para visualización y eliminación (con protección de la cuenta admin activa). | ✅ |
| **Seguridad de Rutas** | Componente guardián `RutaProtegida` que restringe el acceso al panel `/admin` solo a usuarios con rol `admin`. | ✅ |
| **Simulación de Autenticación** | Login y Registro con validaciones, hashing/distinción entre Administrador precargado y usuarios invitados. | ✅ |
| **Catálogo de +20 Productos** | **22 videojuegos completos** precargados (Cyberpunk 2077, Elden Ring, Baldur's Gate 3, RDR2, God of War, etc.). | ✅ |
| **Diseño Responsive & Moderno** | UI moderna para gaming con paleta oscura, acentos neon, cards interactivas y tipografía Google Fonts. | ✅ |

---

## 🔑 Credenciales de Acceso para Evaluación

Para facilitar la revisión por parte del equipo docente y evaluadores, en la pantalla de [Iniciar Sesión](/login) se encuentran botones de **Acceso Rápido Demo**, o bien pueden ingresarse manualmente:

### 👑 Perfil Administrador (Acceso completo a `/admin`)
- **Titular:** Francisco Delgado (Team Leader)
- **Correo Electrónico:** `admin@rollinggames.com`
- **Contraseña:** `admin123`
- **Permisos:** Gestión de inventario (CRUD videojuegos), recarga de datos de fábrica y eliminación de usuarios.

### 👤 Perfil Usuario Gamer (Cliente estándar)
- **Titular:** Franco Triviño (Scrum Master)
- **Correo Electrónico:** `user@rollinggames.com`
- **Contraseña:** `user123`
- **Permisos:** Navegación, guardado en lista de deseos y publicación de reseñas comunitarias.

> *Nota: También es posible registrar nuevos usuarios desde la pestaña "Crear Cuenta".*

---

## 🚀 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Rolling-Gamer
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   Ingresa a `http://localhost:5173` (o el puerto indicado en la consola).

5. **Compilar para producción (Build):**
   ```bash
   npm run build
   ```

---

## 📁 Estructura del Proyecto

```text
Rolling-Gamer/
├── public/
│   └── _redirects              # Configuración de SPA para Netlify/Vercel
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Menu.jsx        # Navbar con avatar, roles y contador de deseos
│   │   │   ├── Footer.jsx      # Pie de página gamer con enlaces y créditos
│   │   │   └── RutaProtegida.jsx # Guardián de seguridad para rutas privadas
│   │   └── pages/
│   │       ├── Inicio.jsx      # Catálogo con Hero, buscador y filtros
│   │       ├── DetalleDeProducto.jsx # Ficha técnica, requisitos y reseñas dinámicas
│   │       ├── Administrador.jsx # Panel de control (CRUD Juegos y Usuarios)
│   │       ├── Login.jsx       # Login & Registro con acceso demo rápido
│   │       ├── Wishlist.jsx    # Lista de deseos del usuario
│   │       ├── About.jsx       # Información del equipo, Trello y metodologías
│   │       ├── Error404.jsx    # Pantalla 404 personalizada con temática gamer
│   │       └── producto/
│   │           ├── CardJuego.jsx          # Tarjeta interactiva de juego
│   │           ├── FormularioProducto.jsx # Creación y edición con react-hook-form
│   │           └── ItemProducto.jsx       # Fila de tabla de administración
│   ├── context/
│   │   └── AuthContext.jsx     # Contexto global de sesión, usuarios y wishlist
│   ├── data/
│   │   ├── juegosIniciales.js  # Dataset de 19 videojuegos reales con especificaciones y assets locales
│   │   └── usuariosIniciales.js # Cuentas predeterminadas (Admin y Usuario)
│   ├── App.jsx                 # Configuración de rutas y estado de inventario
│   ├── index.css               # Sistema de diseño gamer con CSS variables
│   └── main.jsx                # Inicialización de la aplicación
├── package.json
└── vite.config.js
```

---

## 👥 Equipo de Desarrollo

El proyecto fue concebido, diseñado e implementado por:
- **[Francisco Delgado (Franc-Devel)](https://github.com/Franc-Devel)**: *Team Leader & Full Stack Developer* — Arquitectura general con React 19, persistencia de catálogo en `LocalStorage`, enrutamiento con React Router, seguridad y panel de administración.
- **[Franco Triviño (francotrivio321)](https://github.com/francotrivio321)**: *Scrum Master & Frontend Developer* — Organización ágil y gestión de sprints en Trello, diseño temático inspirado en Epic Games Store, validaciones de formularios y experiencia de usuario.

---

## 🌐 Despliegue (Netlify / Vercel)

El proyecto incluye el archivo `public/_redirects` para garantizar que el enrutamiento del lado del cliente (`client-side routing` de React Router) funcione correctamente al recargar páginas profundas como `/detalle/:id` o `/admin`.

### Para desplegar en Netlify:
1. Conectar el repositorio de GitHub en Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. ¡Listo! El archivo `_redirects` se copiará automáticamente a `dist/_redirects`.

---

© 2025 **ROLLING GAMER** - Proyecto Educativo para RollingCode School.
