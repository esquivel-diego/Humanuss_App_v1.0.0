import React, { useLayoutEffect, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Moon, Sun, Menu, LayoutDashboard, Settings, Boxes,
  Plane, CalendarX, FileText, Megaphone, ArrowLeft, LogOut, Bell
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
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
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const notifications = useNotificationStore((state) => state.notifications)

  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [activeMenu, setActiveMenu] = useState<'main' | 'modules' | 'rrhh'>('main')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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

  const unreadCount = notifications.filter(n => !n.read && n.userId === user?.id).length

  const mainMenu: MenuItem[] = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={18} /> },
    {
      path: '/notificaciones',
      label: 'Notificaciones',
      icon: (
        <div className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </div>
      )
    },
    { label: 'Modules', icon: <Boxes size={18} />, action: () => setActiveMenu('modules') }
  ]

  if (user?.role === 'admin') {
    mainMenu.push(
      { path: '/admin/solicitudes', label: 'Solicitudes', icon: <FileText size={18} /> },
      { path: '/admin/noticias', label: 'Publicar noticias', icon: <Megaphone size={18} /> }
    )
  }

  const moduleMenu: MenuItem[] = [
    { label: 'Back', icon: <ArrowLeft size={18} />, action: () => setActiveMenu('main'), isPrimary: true },
    { path: '/modules/vacaciones', label: 'Leave Request', icon: <Plane size={18} /> },
    { path: '/modules/ausencias', label: 'Absences', icon: <CalendarX size={18} /> },
    { label: 'HR Requests', icon: <FileText size={18} />, action: () => setActiveMenu('rrhh') },
    { path: '/modules/novedades', label: 'News', icon: <Megaphone size={18} /> }
  ]

  const rrhhMenu: MenuItem[] = [
    { label: 'Back', icon: <ArrowLeft size={18} />, action: () => setActiveMenu('modules'), isPrimary: true },
    { path: '/modules/rrhh/work-certificate', label: 'Work Certificate', icon: <FileText size={18} /> },
    { path: '/modules/rrhh/income-certification', label: 'Income Certification', icon: <FileText size={18} /> }
  ]

  const currentMenu =
    activeMenu === 'main' ? mainMenu :
    activeMenu === 'modules' ? moduleMenu :
    rrhhMenu

  return (
    <aside
      className={cn(
        'h-screen sidebar-background border-r transition-all duration-300 flex flex-col justify-between',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div>
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <span className="text-xl font-bold">Humanuss</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded transition dark:hover:bg-gray-700 hover:bg-[#7f8db0] hover:text-white"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-2">
          {currentMenu.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition',
                  location.pathname === item.path
                    ? 'bg-[#7f8db0] text-white'
                    : 'hover:bg-[#7f8db0] hover:text-white dark:hover:bg-gray-800'
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
                    : 'hover:bg-[#7f8db0] hover:text-white dark:hover:bg-gray-800 text-black dark:text-white'
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          )}
        </nav>
      </div>

      <div className="px-2 py-4 flex flex-col gap-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>

        <hr className="border-t border-gray-200 dark:border-gray-700 mb-2" />

        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md group transition',
            theme === 'light'
              ? 'hover:bg-[#7f8db0] hover:text-white text-black'
              : 'hover:bg-gray-800 text-white'
          )}
        >
          {theme === 'light'
            ? <Moon size={18} className="text-black group-hover:text-white transition" />
            : <Sun size={18} />}
          {!collapsed && (
            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
