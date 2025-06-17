import { useEffect } from 'react'
import DaysCard from '@components/cards/DaysCard'
import PayrollCard from '@components/cards/PayrollCard'
import AttendanceCard from '@components/cards/AttendanceCard'
import CheckInCard from '@components/cards/CheckInCard'
import CheckOutCard from '@components/cards/CheckOutCard'

/**
 * Página principal del dashboard que muestra las 5 tarjetas clave:
 * - Días disponibles
 * - Nómina
 * - Asistencia
 * - Check-in
 * - Check-out
 */

const Dashboard = () => {
  useEffect(() => {
    document.title = 'Humanuss | Dashboard'
  }, [])

  return (
    <div className="max-w-5xl mx-auto grid gap-6 p-4">
      {/* Sección de usuario */}
      <div className="flex items-center justify-between px-2 py-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Diego Esquivel
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Desarrollador de software
          </p>
        </div>
        <img
          src="src/assets/logo.svg"
          alt="Foto de perfil"
          className="w-14 h-14 rounded-full object-cover shadow-md"
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
