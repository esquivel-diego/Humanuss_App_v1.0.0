import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  Moon, Sun, Menu, LayoutDashboard, Settings, Boxes,
  Plane, CalendarX, FileText, Megaphone, ArrowLeft
} from 'lucide-react'
import { useState, useLayoutEffect } from 'react'
import { cn } from '@utils/cn'

type MenuItem = {
  label: string
  icon: React.ReactNode
  path?: string
  action?: () => void
  isPrimary?: boolean
}

const Sidebar = () => {
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [activeMenu, setActiveMenu] = useState<'main' | 'modules'>('main')

  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolvedTheme: 'light' | 'dark' = storedTheme ?? (prefersDark ? 'dark' : 'light')
    setTheme(resolvedTheme)
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const mainMenu: MenuItem[] = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/settings', label: 'Configuración', icon: <Settings size={18} /> },
    { label: 'Módulos', icon: <Boxes size={18} />, action: () => setActiveMenu('modules') }
  ]

  const moduleMenu: MenuItem[] = [
    {
      label: 'Volver',
      icon: <ArrowLeft size={18} />,
      action: () => setActiveMenu('main'),
      isPrimary: true
    },
    { path: '/modules/vacaciones', label: 'Vacaciones', icon: <Plane size={18} /> },
    { path: '/modules/ausencias', label: 'Ausencias', icon: <CalendarX size={18} /> },
    { path: '/modules/solicitudes', label: 'Solicitudes RRHH', icon: <FileText size={18} /> },
    { path: '/modules/novedades', label: 'Novedades', icon: <Megaphone size={18} /> }
  ]

  const currentMenu = activeMenu === 'main' ? mainMenu : moduleMenu

  return (
    <aside
      className={cn(
        'h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-700 transition-all duration-300 flex flex-col justify-between',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div>
        {/* Encabezado */}
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <span className="text-xl font-bold">Humanuss</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Menú */}
        <nav className="flex flex-col gap-1 px-2">
          {currentMenu.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800',
                  location.pathname === item.path && 'bg-gray-200 dark:bg-gray-700'
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-left transition',
                  item.isPrimary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white'
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Separador + modo oscuro */}
      <div className="px-2 py-4 flex flex-col gap-2">
        <hr className="border-t border-gray-200 dark:border-gray-700 mb-2" />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {!collapsed && (
            <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
