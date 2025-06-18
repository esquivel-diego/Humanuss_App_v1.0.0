import { Outlet } from 'react-router-dom'
import MoodModal from '../components/MoodModal'
import Sidebar from '../components/nav/Sidebar'

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
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 pb-6 box-border">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
