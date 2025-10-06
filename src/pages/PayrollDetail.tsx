import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuthStore } from "@store/authStore"
import { getPayrollForUser, getPayrollDetail } from "@services/payrollService"
import type { PayrollPayment } from "@services/payrollService"

type Line = { label: string; amount: number }
type Totals = { ingresos: number; descuentos: number; liquido: number }
type Header = {
  establecimiento: string
  nombre: string
  puesto: string
  fechaInicial: string | null
  fechaFinal: string | null
}

const PayrollDetail = () => {
  const { index } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [payment, setPayment] = useState<PayrollPayment | null>(null)
  const [earnings, setEarnings] = useState<Line[]>([])
  const [deductions, setDeductions] = useState<Line[]>([])
  const [totals, setTotals] = useState<Totals | null>(null)
  const [header, setHeader] = useState<Header | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || index === undefined) return
      setLoading(true)

      try {
        // 1) obtener el período desde la tabla
        const all = await getPayrollForUser()
        if (!Array.isArray(all)) throw new Error("Respuesta inesperada del servidor")

        const target = all[Number(index)]
        if (!target) {
          setLoading(false)
          return
        }
        setPayment(target)

        // 2) detalle real por PERIODO_AAMMNO (target.date)
        const detail = await getPayrollDetail(target.date)
        setEarnings(detail.earnings)
        setDeductions(detail.deductions)
        setTotals(detail.totals)
        setHeader(detail.header)

      } catch (err) {
        console.error("Error al cargar detalle de boleta:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, index])

  if (loading) {
    return (
      <div className="min-h-screen p-6 text-gray-800 dark:text-gray-100">
        Cargando detalle…
      </div>
    )
  }

  if (!payment || !totals) {
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

  const fmtQ = (n: number) =>
    `Q${n.toLocaleString("es-GT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const fmtDate = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString("es-GT") : ""

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import("jspdf")

      const doc = new jsPDF({ unit: "pt", format: "a4" })
      let y = 60

      // ===== Encabezado =====
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text(header?.establecimiento || "—", 40, y)
      y += 18

      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.text(`Empleado: ${header?.nombre || "—"}`, 40, y); y += 16
      doc.text(`Puesto: ${header?.puesto || "—"}`, 40, y); y += 16
      doc.text(
        `Período: ${fmtDate(header?.fechaInicial)} a ${fmtDate(header?.fechaFinal)}`,
        40,
        y
      )
      y += 28

      // ===== Ingresos =====
      doc.setFont("helvetica", "bold")
      doc.text("INGRESOS", 40, y); y += 14
      doc.setLineWidth(0.5)
      doc.line(40, y, 555, y); y += 10

      doc.setFont("helvetica", "normal")
      earnings.forEach((e) => {
        const label = e.label || "—"
        const amount = fmtQ(e.amount)
        doc.text(label, 40, y)
        doc.text(amount, 555, y, { align: "right" })
        y += 16
      })
      doc.setFont("helvetica", "bold")
      doc.text("Total Ingresos", 40, y)
      doc.text(fmtQ(totals.ingresos), 555, y, { align: "right" })
      y += 26

      // ===== Deducciones =====
      doc.setFont("helvetica", "bold")
      doc.text("DEDUCCIONES", 40, y); y += 14
      doc.setLineWidth(0.5)
      doc.line(40, y, 555, y); y += 10

      doc.setFont("helvetica", "normal")
      deductions.forEach((d) => {
        const label = d.label || "—"
        const amount = fmtQ(d.amount)
        doc.text(label, 40, y)
        doc.text(amount, 555, y, { align: "right" })
        y += 16
      })
      doc.setFont("helvetica", "bold")
      doc.text("Total Deducciones", 40, y)
      doc.text(fmtQ(totals.descuentos), 555, y, { align: "right" })
      y += 26

      // ===== Líquido =====
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("LÍQUIDO A RECIBIR", 40, y)
      doc.text(fmtQ(totals.liquido), 555, y, { align: "right" })

      // Guardar
      const nombreArchivo = `boleta-${payment.date}.pdf`
      doc.save(nombreArchivo)
    } catch (err) {
      console.error("❌ Error generando PDF:", err)
      alert("No se pudo generar el PDF.")
    }
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-white p-6 relative">
      <button
        onClick={() => navigate("/payroll")}
        className="fixed right-4 bottom-24 md:bottom-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
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
            {earnings.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">Sin ingresos detallados.</div>
            ) : (
              earnings.map((e, i) => (
                <div key={i} className="flex justify-between">
                  <span>{e.label}</span>
                  <span>{e.amount.toLocaleString("es-GT")}</span>
                </div>
              ))
            )}
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Ingresos</span>
              <span>{totals.ingresos.toLocaleString("es-GT")}</span>
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
            {deductions.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">Sin deducciones detalladas.</div>
            ) : (
              deductions.map((d, i) => (
                <div key={i} className="flex justify-between">
                  <span>{d.label}</span>
                  <span>{d.amount.toLocaleString("es-GT")}</span>
                </div>
              ))
            )}
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Deducciones</span>
              <span>{totals.descuentos.toLocaleString("es-GT")}</span>
            </div>
          </div>
        </div>

        {/* Líquido a recibir */}
        <div className="card-bg rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between font-bold text-sm uppercase">
            <span>Líquido a recibir</span>
            <span>
              Q{totals.liquido.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
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
