import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuthStore } from "@store/authStore"
import { getPayrollForUser } from "@services/payrollService"
import type { PayrollPayment } from "@services/payrollService"

const PayrollDetail = () => {
  const { index } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [payment, setPayment] = useState<PayrollPayment | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || index === undefined) return

      try {
        const all = await getPayrollForUser()

        if (!Array.isArray(all)) {
          throw new Error("Respuesta inesperada del servidor")
        }

        const target = all[Number(index)]
        if (target) setPayment(target)
      } catch (err) {
        console.error("Error al cargar detalle de boleta:", err)
      }
    }

    fetchData()
  }, [user, index])

  if (!payment) {
    return (
      <div className="min-h-screen p-6 text-gray-800 dark:text-gray-100">
        <p>Boleta no encontrada.</p>
        <button
          onClick={() => navigate("/payroll")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Volver
        </button>
      </div>
    )
  }

  const totalEarnings = payment.earnings.reduce((sum, e) => sum + e.amount, 0)
  const totalDeductions = payment.deductions.reduce((sum, d) => sum + d.amount, 0)

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = payment.downloadUrl || "/boletas/boleta-ejemplo.pdf"
    link.download = `boleta-${payment.date}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    alert("📥 La descarga de la boleta ha comenzado.")
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-white p-6 relative">
      <button
        onClick={() => navigate("/payroll")}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow">
          Detalle del Pago
        </div>

        {/* Ingresos */}
        <div className="card-bg rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between font-semibold text-sm uppercase border-b pb-2 mb-2">
            <span>Ingresos</span>
            <span>Monto</span>
          </div>
          <div className="text-sm space-y-2">
            {payment.earnings.map((e, i) => (
              <div key={i} className="flex justify-between">
                <span>{e.label}</span>
                <span>{e.amount.toLocaleString("es-GT")}</span>
              </div>
            ))}
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Ingresos</span>
              <span>{totalEarnings.toLocaleString("es-GT")}</span>
            </div>
          </div>
        </div>

        {/* Deducciones */}
        <div className="card-bg rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between font-semibold text-sm uppercase border-b pb-2 mb-2">
            <span>Deducciones</span>
            <span>Monto</span>
          </div>
          <div className="text-sm space-y-2">
            {payment.deductions.map((d, i) => (
              <div key={i} className="flex justify-between">
                <span>{d.label}</span>
                <span>{d.amount.toLocaleString("es-GT")}</span>
              </div>
            ))}
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Deducciones</span>
              <span>{totalDeductions.toLocaleString("es-GT")}</span>
            </div>
          </div>
        </div>

        {/* Líquido a recibir */}
        <div className="card-bg rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between font-bold text-sm uppercase">
            <span>Líquido a recibir</span>
            <span>
              Q{payment.amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-semibold text-sm transition"
          >
            DESCARGAR BOLETA
          </button>
        </div>
      </div>
    </div>
  )
}

export default PayrollDetail
