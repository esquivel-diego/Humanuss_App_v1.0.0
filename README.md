# 🧠 Humanuss App

**Humanuss** es una aplicación web modular y escalable para la gestión del recurso humano, diseñada como una extensión de una plataforma principal conectada exclusivamente por API. Permite a empresas gestionar asistencia, nómina, solicitudes y comunicación con sus colaboradores de forma intuitiva y personalizable.

---

## 🚀 Tecnologías utilizadas

- **React + Vite + TypeScript** – Frontend moderno, veloz y tipado
- **Zustand** – Estado global simple y eficiente
- **TailwindCSS** – Utilidades de estilo modernas con dark mode integrado
- **React Router DOM** – Navegación por rutas protegidas
- **LocalStorage** – Persistencia de sesión e interacciones
- **PostCSS & Autoprefixer** – Procesamiento CSS
- **Vercel** (futuro) – Deploy continuo

---

## 📁 Estructura del proyecto

```txt
src/
├── assets/                # Imágenes, íconos, logos
├── components/            # Componentes reutilizables (ej. MoodModal)
├── layouts/               # Layouts generales como AppLayout
├── pages/                 # Vistas: Login, Home, Dashboard, etc.
├── routes/                # AppRouter y rutas protegidas
├── store/                 # Zustand stores: auth, mood, etc.
├── types/                 # Tipados globales
├── utils/                 # Funciones auxiliares reutilizables
├── index.css              # Estilos globales
├── main.tsx               # Entry point: carga tema y estado inicial
├── App.tsx                # AppRouter principal
```

---

## 🧪 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/esquivel-diego/humanuss.git
cd humanuss
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar en entorno local

```bash
npm run dev
```

Abre el navegador en [http://localhost:5173](http://localhost:5173)

---

## 🔐 Funcionalidades implementadas

- ✅ Login simulado con persistencia (`localStorage`)
- ✅ Rutas protegidas (`<PrivateRoute />`)
- ✅ Logout funcional con redirección
- ✅ Dark mode con persistencia
- ✅ Modal diario de estado de ánimo (único por día)

---

## 📦 Roadmap de desarrollo (MVP)

| Fase | Descripción                            | Estado  |
|------|----------------------------------------|---------|
| 0    | Setup, Tailwind, estructura inicial    | ✅      |
| 1    | Login + Mood modal + rutas protegidas  | ✅      |
| 2    | Dashboard con 5 cards dinámicas        | 🔜      |
| 3    | Formulario de solicitudes RRHH         | 🔜      |
| 4    | Perfil colaborador + organigrama       | 🔜      |
| 5    | Funciones de administrador             | 🔜      |
| 6    | Notificaciones simuladas               | 🔜      |

---

## 🧑‍💻 Contribución

1. Crea una nueva rama desde `main`:
   ```bash
   git checkout -b feat/nombre-funcionalidad
   ```

2. Asegúrate de usar commits semánticos:
   ```bash
   git commit -m "feat: add dashboard card for attendance"
   ```

3. Crea un PR con descripción clara del cambio

---

## 📎 Notas adicionales

- Todos los componentes deben estar **comentados profesionalmente**
- Se sigue el enfoque **mobile-first** con adaptaciones progresivas
- Estado global manejado 100% con **Zustand**
- Modal de estado de ánimo se controla por **fecha en localStorage**
- Toda la lógica de sesión es independiente de backend (por ahora)

---

## 📤 Deploy (en preparación)

Este proyecto será desplegado en Vercel.  
El comando de build será:

```bash
npm run build
```

---

## 🧑 Autor

Desarrollado por Diego Esquivel
[esquivel-diego](https://github.com/esquivel-diego)
