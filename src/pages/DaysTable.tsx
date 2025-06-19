import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import data from "@mocks/days.json"

interface Request {
  date: string
  type: string
  status: string
}

const DaysTable = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRequests(data.requests)
  }, [])

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6 relative">
      {/* Botón flotante de regreso */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Solicitudes de Días
        </div>

        <div className="overflow-x-auto card-bg shadow-xl rounded-2xl">
          <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Fecha
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Tipo
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requests.map((req, i) => {
                const statusUpper = req.status.toUpperCase()
                const statusColor =
                  statusUpper === "APROBADO" || statusUpper === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"

                return (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-sm">{req.date}</td>
                    <td className="px-6 py-4 text-sm">{req.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}
                      >
                        {statusUpper}
                      </span>
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

export default DaysTable
