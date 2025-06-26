import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getAllRequests } from '@services/requestService'
import type { Request } from '@services/requestService'

const DaysCard = () => {
  const totalDays = 15
  const [availableDays, setAvailableDays] = useState<number>(totalDays)
  const [requests, setRequests] = useState<Request[]>([])
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

useEffect(() => {
  const fetchData = async () => {
    if (!user) return

    try {
      const all = await getAllRequests() // ← FIX AQUÍ
      const approved = all.filter(
        (r) =>
          r.status.toLowerCase() === 'aprobada' &&
          (r.type === 'Vacación' || r.type === 'Permiso')
      )

      setRequests(all)
      setAvailableDays(totalDays - approved.length)
    } catch (error) {
      console.error('Error al cargar solicitudes:', error)
    }
  }

  fetchData()
}, [user])


  const takenDays = totalDays - availableDays
  const lastStatus = requests[0]?.status || 'N/A'
  const isApproved =
    lastStatus.toLowerCase() === 'aprobada' || lastStatus.toLowerCase() === 'approved'

  return (
    <div
      onClick={() => navigate('/days')}
      className="card-bg rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
    >
      <h2 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase mb-4">
        DÍAS DISPONIBLES
      </h2>

      <div className="flex justify-center gap-20">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Tomados</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {takenDays.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Disponibles</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {availableDays.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase whitespace-nowrap">Último estatus</p>
          <span
            className={`inline-block text-xs font-semibold px-4 py-1 rounded-full ${
              isApproved
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {lastStatus.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DaysCard
