// src/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import MoodModal from '../components/MoodModal'
import Sidebar from '../components/nav/Sidebar'
import MobileNav from '../components/nav/MobileNav' // 👈 Importado el menú móvil

export default function AppLayout() {
  return (
    <div className="flex h-screen text-black dark:text-white bg-background dark:bg-background overflow-hidden">
      {/* Sidebar visible solo en pantallas md en adelante */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex flex-col flex-1">
        <MoodModal />

        {/* Main: contenido desplazable si es necesario, sin causar scroll global */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6 box-border">
          <Outlet />
        </main>
      </div>

      {/* 👇 Menú inferior visible solo en pantallas pequeñas */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
