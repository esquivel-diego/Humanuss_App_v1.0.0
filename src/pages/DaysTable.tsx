import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@store/authStore'
import { getRequestIndicators } from '@services/indicatorService'

type Row = {
  number: number
  type: string
  status: string
  date: string
}

const formatDate = (iso?: string | null) => {
  if (!iso) return '--'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '--'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

const mapStatus = (code?: string): string => {
  const c = (code ?? '').toUpperCase()
  if (c === 'A') return 'APROBADA'
  if (c === 'R') return 'RECHAZADA'
  if (c === 'P' || c === 'E') return 'PENDIENTE'
  return 'PENDIENTE'
}

const DaysTable = () => {
  const [requests, setRequests] = useState<Row[]>([])
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const records = await getRequestIndicators()
        const mapped: Row[] = records
          .map((r) => ({
            number: r.NUMERO,
            type: r.TIPO ?? '-',
            status: mapStatus(r.ESTADO),
            date: formatDate(r.FECHA),
          }))
          .sort(
            (a, b) =>
              new Date(b.date.split('/').reverse().join('-')).getTime() -
              new Date(a.date.split('/').reverse().join('-')).getTime()
          )

        setRequests(mapped)
      } catch (error) {
        console.error('Error al cargar solicitudes:', error)
        setRequests([])
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6 relative pb-20">
      {/* Botón flotante de regreso (más alto en mobile para no tapar el menú) */}
      <button
        onClick={() => navigate('/')}
        className="fixed right-4 bottom-24 md:bottom-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Solicitudes de Días
        </div>

        {/* En móviles dejamos crecer en alto; en md+ limitamos a 70vh. */}
        <div className="card-bg shadow-xl rounded-2xl overflow-x-auto overflow-y-auto w-full md:max-h-[70vh]">
          {/* Quitamos min-w fija para permitir que el contenido envuelva en pantallas pequeñas */}
          <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700 w-full">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Nº Solicitud
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Tipo
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Estado
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 whitespace-nowrap">
                  Solicitado el
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-sm text-center text-gray-400">
                    No hay solicitudes registradas.
                  </td>
                </tr>
              ) : (
                requests.map((req, i) => {
                  const statusUpper = req.status.toUpperCase()
                  const statusColor =
                    statusUpper === 'APROBADA' || statusUpper === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : statusUpper === 'RECHAZADA' || statusUpper === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'

                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{req.number}</td>

                      {/* Tipo: permitir 2 líneas máximo y corte elegante */}
                      <td className="px-6 py-4 text-sm align-top">
                        <span
                          className="block leading-snug"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            wordBreak: 'break-word',
                          }}
                        >
                          {req.type}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                          {statusUpper}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{req.date}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DaysTable
