import { useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import MoodModal from '../components/MoodModal'
import Sidebar from '../components/nav/Sidebar'

export default function AppLayout() {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="flex min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
            <Sidebar />

            <div className="flex flex-col flex-1">
                <MoodModal />

                <header className="w-full p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Humanuss</h1>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 border rounded text-red-600 border-red-500 hover:bg-red-100 dark:hover:bg-red-800"
                    >
                        🔒 Cerrar sesión
                    </button>
                </header>

                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
