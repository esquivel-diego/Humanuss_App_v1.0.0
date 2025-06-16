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
      {/* Fila 1: Days + Payroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DaysCard />
        <PayrollCard />
      </div>

      {/* Fila 2: Attendance */}
      <div>
        <AttendanceCard />
      </div>

      {/* Fila 3: Check-in + Check-out (cards separadas 50% cada una) */}
      <div className="grid grid-cols-2 gap-4">
  <CheckInCard />
  <CheckOutCard />
</div>
    </div>
  )
}

export default Dashboard
