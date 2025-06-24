import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuthStore } from "@store/authStore"
import { getPayrollForUser } from "@services/payrollService"

interface Payment {
  amount: number
  date: string
}

const formatMonth = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = date.toLocaleString("es-ES", { month: "long" }).toUpperCase()
  const year = date.getFullYear()
  const quincena = date.getDate() <= 15 ? "PRIMERA QUINCENA" : "SEGUNDA QUINCENA"
  return { month, year, quincena }
}

const PayrollTable = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return
      try {
        const data = await getPayrollForUser(user)
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setPayments(sorted)
      } catch (err) {
        console.error("Error al obtener boletas:", err)
      }
    }

    fetchData()
  }, [user])

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
          Nómina y Pagos
        </div>

        <div className="overflow-x-auto card-bg shadow-xl rounded-2xl">
          <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Mes
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Quincena
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Año
                </th>
                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment, i) => {
                const { month, year, quincena } = formatMonth(payment.date)
                return (
                  <tr
                    key={i}
                    onClick={() => navigate(`/payroll/${i}`)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-sm">{month}</td>
                    <td className="px-6 py-4 text-sm">{quincena}</td>
                    <td className="px-6 py-4 text-sm">{year}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      Q{Number(payment.amount).toLocaleString("es-GT", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                )
              })}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-4 text-gray-500 dark:text-gray-400">
                    No hay boletas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PayrollTable
