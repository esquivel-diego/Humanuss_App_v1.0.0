// src/components/DaysCard.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { getAllRequests } from '@services/requestService'
import { getRecentVacationDaysV2, getRequestIndicators } from '@services/indicatorService'
import type { Request } from '@services/requestService'

const truncate1Decimal = (num: number) => Math.floor(num * 10) / 10

// Mismo mapeo que usas en la tabla
const mapStatus = (code?: string): string => {
  const c = (code ?? '').toUpperCase()
  if (c === 'A') return 'APROBADA'
  if (c === 'R') return 'RECHAZADA'
  if (c === 'P' || c === 'E') return 'PENDIENTE'
  return 'PENDIENTE'
}

const DaysCard = () => {
  const [diasTomados, setDiasTomados] = useState(0)
  const [diasDisponibles, setDiasDisponibles] = useState(0)
  const [lastStatus, setLastStatus] = useState('N/A')
  const [periodRange, setPeriodRange] = useState('--') // se conserva (no visible)

  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      // --- Indicadores (v2) ---
      try {
        const rec = await getRecentVacationDaysV2()

        if (rec) {
          const tomados = truncate1Decimal(Number(rec.DIAS_TOMADOS ?? 0))
          const disponiblesRaw =
            rec.DIAS_DISPONIBLES ?? Math.max(Number(rec.DIAS_TOTALES ?? 0) - tomados, 0)

          setDiasTomados(tomados)
          setDiasDisponibles(truncate1Decimal(Number(disponiblesRaw)))

          const y = new Date(rec.PERIODO_AAMMNO).getUTCFullYear()
          if (!isNaN(y)) setPeriodRange(`${y}-${y + 1}`)
          else setPeriodRange('--')
        } else {
          setDiasTomados(0)
          setDiasDisponibles(0)
          setPeriodRange('--')
        }
      } catch (err) {
        console.error('❌ Error al cargar indicadores (v2):', err)
        setPeriodRange('--')
      }

      // --- Último estatus de solicitud (primero por /INDICADORES/SOLICITUDES; fallback a getAllRequests) ---
      try {
        const indicators = await getRequestIndicators()
        if (Array.isArray(indicators) && indicators.length > 0) {
          const latest = [...indicators].sort(
            (a, b) => new Date(b.FECHA).getTime() - new Date(a.FECHA).getTime()
          )[0]
          setLastStatus(mapStatus(latest?.ESTADO))
        } else {
          // Fallback legacy para no romper nada
          const requests: Request[] = await getAllRequests(user)
          const sorted = requests
            // quitamos el filtro estricto de nombres para no dejar fuera casos como "P - PERMISO"
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          setLastStatus(sorted[0]?.status ?? 'N/A')
        }
      } catch (err) {
        console.warn('⚠️ No se pudo obtener estado de solicitud por indicadores; usando fallback:', err)
        try {
          const requests: Request[] = await getAllRequests(user)
          const sorted = requests.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          setLastStatus(sorted[0]?.status ?? 'N/A')
        } catch (e) {
          setLastStatus('N/A')
        }
      }
    }

    fetchData()
  }, [user])

  const statusUpper = (lastStatus || 'N/A').toUpperCase()
  const chipColor =
    statusUpper === 'APROBADA' || statusUpper === 'APPROVED'
      ? 'bg-green-100 text-green-700'
      : statusUpper === 'RECHAZADA' || statusUpper === 'REJECTED'
      ? 'bg-red-100 text-red-700'
      : 'bg-yellow-100 text-yellow-700' // PENDIENTE / N/A / otros

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
            {diasTomados.toFixed(1).padStart(4, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase">Disponibles</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {diasDisponibles.toFixed(1).padStart(4, '0')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 uppercase whitespace-nowrap">Estado solicitud</p>
          <span
            className={`inline-block text-xs font-semibold px-4 py-1 rounded-full ${chipColor}`}
          >
            {statusUpper}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DaysCard
