import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import MoodModal from '../components/MoodModal'

type Props = {
    children: ReactNode
}

export default function AppLayout({ children }: Props) {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const toggleDarkMode = () => {
        const root = document.documentElement
        const isDark = root.classList.contains('dark')

        if (isDark) {
            root.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        } else {
            root.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
            <MoodModal />

            <header className="w-full p-4 border-b dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Humanuss</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleDarkMode}
                        className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        🌙 Toggle
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 border rounded text-red-600 border-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                    >
                        🔒 Cerrar sesión
                    </button>
                </div>
            </header>

            <main className="p-6">{children}</main>
        </div>
    )
}
