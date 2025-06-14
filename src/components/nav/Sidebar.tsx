import { useLocation } from 'react-router-dom'
import { Moon, Sun, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@utils/cn'

const Sidebar = () => {
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [theme, setTheme] = useState<'dark' | 'light'>('light')

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'dark' | 'light'
        setTheme(storedTheme || 'light')
        document.documentElement.classList.toggle('dark', storedTheme === 'dark')
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    const menu = [
        { path: '/', label: 'Dashboard' },
        { path: '/attendance', label: 'Asistencia' },
        { path: '/days', label: 'Días' },
        { path: '/payroll', label: 'Nómina' },
        { path: '/settings', label: 'Configuración' },
        { path: '/modules', label: 'Módulos' },
    ]

    return (
        <aside
            className={cn(
                'h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-700 transition-all duration-300 flex flex-col justify-between',
                collapsed ? 'w-16' : 'w-64'
            )}
        >
            <div>
                {/* Toggle del menú */}
                <div className="p-4 flex justify-between items-center">
                    <span className={cn('text-xl font-bold transition-all', collapsed && 'hidden')}>
                        Humanuss
                    </span>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex flex-col gap-1 px-2">
                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-800',
                                location.pathname === item.path && 'bg-gray-200 dark:bg-gray-700'
                            )}
                        >
                            {!collapsed && <span>{item.label}</span>}
                            {collapsed && (
                                <span className="text-sm" title={item.label}>
                                    {item.label[0]}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Toggle de tema */}
            <div className="px-2 py-4 flex flex-col gap-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
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
