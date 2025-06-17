import { useParams, useNavigate } from "react-router-dom";
import payrollData from "@mocks/payroll.json";

const getBoletaUrl = (): string => {
  return "/boletas/boleta-ejemplo.pdf";
};

const PayrollDetail = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const paymentIndex = Number(index);

  const payment = payrollData.payments[paymentIndex];

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
        <p>Boleta no encontrada.</p>
        <button onClick={() => navigate("/payroll")} className="mt-4 text-blue-600 hover:underline">
          ← Volver
        </button>
      </div>
    );
  }

  const formattedAmount = payment.amount.toLocaleString("es-GT", { minimumFractionDigits: 0 });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getBoletaUrl();
    link.download = `boleta-${payment.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("📥 La descarga de la boleta ha comenzado.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white p-6">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow">
          Detalle
        </div>

        {/* INGRESOS */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between font-semibold text-sm uppercase border-b pb-2 mb-2">
            <span>Ingresos</span>
            <span>Monto</span>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Sueldo Ordinario</span>
              <span>6,000</span>
            </div>
            <div className="flex justify-between">
              <span>Bonificación Decreto 37-2001</span>
              <span>250</span>
            </div>
            <div className="flex justify-between">
              <span>Bonificación Incentivo</span>
              <span>5,500</span>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Ingresos</span>
              <span>11,750</span>
            </div>
          </div>
        </div>

        {/* DEDUCCIONES */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between font-semibold text-sm uppercase border-b pb-2 mb-2">
            <span>Deducciones</span>
            <span>Monto</span>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Impuesto sobre la Renta</span>
              <span>300</span>
            </div>
            <div className="flex justify-between">
              <span>Seguro Social</span>
              <span>250</span>
            </div>
            <div className="flex justify-between">
              <span>Anticipo de Sueldo</span>
              <span>6,000</span>
            </div>
            <hr className="my-2 border-gray-300 dark:border-gray-700" />
            <div className="flex justify-between font-semibold">
              <span>Total Deducciones</span>
              <span>6,550</span>
            </div>
          </div>
        </div>

        {/* LÍQUIDO A RECIBIR */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
          <div className="flex justify-between font-bold text-sm uppercase">
            <span>Líquido a recibir</span>
            <span>{`Q${formattedAmount}`}</span>
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
  );
};

export default PayrollDetail;
