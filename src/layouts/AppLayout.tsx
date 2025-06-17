import { Outlet } from 'react-router-dom'
import MoodModal from '../components/MoodModal'
import Sidebar from '../components/nav/Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <MoodModal />


        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
