import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DaysCard from '@components/cards/DaysCard'
import PayrollCard from '@components/cards/PayrollCard'
import AttendanceCard from '@components/cards/AttendanceCard'
import CheckInCard from '@components/cards/CheckInCard'
import CheckOutCard from '@components/cards/CheckOutCard'
import { useAuthStore } from '@store/authStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    document.title = 'Humanuss | Dashboard'
  }, [])

  return (
    <div className="max-w-5xl mx-auto grid gap-6 px-4 pb-4">
      {/* Sección de usuario */}
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {user?.name ?? 'Usuario'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.role === 'admin' ? 'Administrador' : 'Colaborador'}
          </p>
        </div>
        <img
          onClick={() => navigate('/profile')}
          src={
            user?.photoUrl && user.photoUrl.trim() !== ''
              ? user.photoUrl
              : 'default-avatar.svg'
          }
          alt="Foto de perfil"
          className="w-14 h-14 rounded-full object-cover shadow-md cursor-pointer hover:brightness-110 transition"
        />
      </div>

      {/* Fila 1: Days + Payroll */}
      <div className="grid grid-cols-1 xlgrid:grid-cols-2 gap-6">
        <DaysCard />
        <PayrollCard />
      </div>

      {/* Fila 2: Attendance */}
      <div>
        <AttendanceCard />
      </div>

      {/* Fila 3: Check-in + Check-out */}
      <div className="grid grid-cols-2 gap-4">
        <CheckInCard />
        <CheckOutCard />
      </div>
    </div>
  )
}

export default Dashboard
