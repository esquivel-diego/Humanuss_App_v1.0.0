import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import rawRequests from '@mocks/requests.json'

type Request = {
  id: number
  employee: string
  type: string
  date: string
  status: 'pendiente' | 'aprobada' | 'rechazada'
}

const requestsMock = rawRequests as Request[]

const AdminRequests = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRequests(requestsMock)
  }, [])

  const updateStatus = (id: number, newStatus: 'aprobada' | 'rechazada') => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    )
  }

  const getStatusColor = (status: string) => {
    const upper = status.toUpperCase()
    if (upper === 'APROBADA') return 'bg-green-100 text-green-700'
    if (upper === 'RECHAZADA') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 relative">
      {/* Botón flotante de regreso */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-5xl mx-auto p-6">
        {/* Título estilo DaysTable */}
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Solicitudes de RRHH
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto card-bg shadow-xl rounded-2xl">
          <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Empleado</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Tipo</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Fecha</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Estado</th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-center text-gray-500 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((req) => {
                const statusLabel = req.status.toUpperCase()
                return (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm">{req.employee}</td>
                    <td className="px-6 py-4 text-sm">{req.type}</td>
                    <td className="px-6 py-4 text-sm">{req.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(req.status)}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {req.status === 'pendiente' ? (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => updateStatus(req.id, 'aprobada')}
                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => updateStatus(req.id, 'rechazada')}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="italic text-gray-500 dark:text-gray-400 text-sm">Sin acciones</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminRequests
