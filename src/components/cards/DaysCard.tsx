import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getVacationIndicators } from '@services/indicatorService'
import { getAllRequests } from '@services/requestService'
import type { Request } from '@services/requestService'

const DaysCard = () => {
  const [diasTomados, setDiasTomados] = useState(0)
  const [diasDisponibles, setDiasDisponibles] = useState(0)
  const [diasPagados, setDiasPagados] = useState(0)
  const [lastStatus, setLastStatus] = useState('N/A')

  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // 🔒 Indicadores desde backend oficial
        const indicators = await getVacationIndicators(user)

        if (
          indicators &&
          typeof indicators === 'object' &&
          'diasGozados' in indicators &&
          'cantidad' in indicators &&
          'diasPagados' in indicators
        ) {
          setDiasTomados(indicators.diasGozados ?? 0)
          setDiasDisponibles(indicators.cantidad ?? 0)
          setDiasPagados(indicators.diasPagados ?? 0)
        } else {
          console.warn('⚠️ Indicadores con formato inesperado:', indicators)
        }
      } catch (err) {
        console.error('❌ Error al cargar indicadores:', err)
      }

      try {
        // 🔒 Última solicitud desde backend propio
        const requests: Request[] = await getAllRequests(user)
        const filtered = requests.filter(
          (r) => r.type === 'Vacación' || r.type === 'Permiso'
        )

        const sorted = filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        setLastStatus(sorted[0]?.status ?? 'N/A')
      } catch (err) {
        console.warn('⚠️ No se pudo obtener historial de solicitudes:', err)
      }
    }

    fetchData()
  }, [user])

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

      <div className="flex justify-center gap-10 md:gap-16 lg:gap-20">
        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Tomados</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {diasTomados.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Disponibles</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {diasDisponibles.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Pagados</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {diasPagados.toString().padStart(2, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase whitespace-nowrap">Último estatus</p>
          <span
            className={`inline-block text-xs font-semibold px-4 py-1 rounded-full ${
              isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
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
