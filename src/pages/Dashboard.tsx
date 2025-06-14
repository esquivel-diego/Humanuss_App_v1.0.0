// src/pages/Dashboard.tsx
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
            <DaysCard />
            <PayrollCard />
            <AttendanceCard />
            <CheckInCard />
            <CheckOutCard />
        </div>
    )
}

export default Dashboard
