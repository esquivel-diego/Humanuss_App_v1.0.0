import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNotificationStore } from '@store/notificationStore'
import { useRequestStore } from '@store/requestStore'
import users from '@mocks/users.json'

const AdminRequests = () => {
  const navigate = useNavigate()
  const requests = useRequestStore((state) => state.requests)
  const fetchRequests = useRequestStore((state) => state.fetchRequests)
  const updateRequestStatus = useRequestStore((state) => state.updateStatus)
  const addNotification = useNotificationStore((state) => state.addNotification)

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const buildNotificationMessage = (type: string, status: 'aprobada' | 'rechazada') => {
    const t = type.toLowerCase()
    if (t === 'vacaciones' || t === 'permiso') {
      return `Tu solicitud de ${t} ha sido ${status}`
    }
    if (t === 'constancia laboral') {
      return `Tu constancia laboral fue ${status === 'aprobada' ? 'generada' : 'rechazada'}`
    }
    if (t === 'certificación de ingresos') {
      return `Tu certificación de ingresos fue ${status === 'aprobada' ? 'generada' : 'rechazada'}`
    }
    return `Tu solicitud de ${t} ha sido ${status}`
  }

  const handleUpdate = (id: number, newStatus: 'aprobada' | 'rechazada') => {
    const req = requests.find((r) => r.id === id)
    if (!req) return

    addNotification({
      userId: req.userId,
      message: buildNotificationMessage(req.type, newStatus),
      date: new Date().toISOString(),
      read: false
    })

    updateRequestStatus(id, newStatus)
  }

  const getStatusColor = (status: string) => {
    const upper = status.toUpperCase()
    if (upper === 'APROBADA') return 'bg-green-100 text-green-700'
    if (upper === 'RECHAZADA') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 relative">
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Solicitudes de RRHH
        </div>

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
                const user = users.find((u) => u.id === req.userId)
                const employeeName = user?.name || 'Desconocido'
                const statusLabel = req.status.toUpperCase()

                return (
                  <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 text-sm">{employeeName}</td>
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
                            onClick={() => handleUpdate(req.id, 'aprobada')}
                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleUpdate(req.id, 'rechazada')}
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
