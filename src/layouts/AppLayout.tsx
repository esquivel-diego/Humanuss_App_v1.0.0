import { Outlet } from 'react-router-dom'
import MoodModal from '../components/MoodModal'
import Sidebar from '../components/nav/Sidebar'

export default function AppLayout() {
    return (
        <div className="flex min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white overflow-x-hidden">
            {/* Sidebar visible solo en pantallas md en adelante */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1">
                <MoodModal />

                {/* Main con padding responsive y sin desbordamiento horizontal */}
                <main className="p-4 sm:p-6 flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
