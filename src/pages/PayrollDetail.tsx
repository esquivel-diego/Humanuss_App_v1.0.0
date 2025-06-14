// src/pages/PayrollDetail.tsx

import { useParams, useNavigate } from "react-router-dom";
import payrollData from "@mocks/payroll.json";

const PayrollDetail = () => {
    const { index } = useParams();
    const navigate = useNavigate();
    const paymentIndex = Number(index);

    const payment = payrollData.payments[paymentIndex];
    const employee = payrollData.employee;

    if (!payment) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
                <p>Boleta no encontrada.</p>
                <button onClick={() => navigate("/payroll")} className="mt-4 text-blue-600 hover:underline">← Volver</button>
            </div>
        );
    }

    const date = new Date(payment.date);
    const month = date.toLocaleString("es-ES", { month: "long" }).toUpperCase();
    const year = date.getFullYear();
    const quincena = date.getDate() <= 15 ? "PRIMERA QUINCENA" : "SEGUNDA QUINCENA";
    const formattedAmount = `Q${payment.amount.toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;

    const handleDownload = () => {
        alert("📄 La boleta se descargará aquí en el futuro.");
        // En el futuro: lógica real para descargar archivo PDF o similar
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
            <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold mb-4">Detalle de Boleta</h1>

                <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Empleado:</span> {employee}</p>
                    <p><span className="font-semibold">Fecha:</span> {payment.date}</p>
                    <p><span className="font-semibold">Mes:</span> {month}</p>
                    <p><span className="font-semibold">Quincena:</span> {quincena}</p>
                    <p><span className="font-semibold">Año:</span> {year}</p>
                    <p><span className="font-semibold">Monto:</span> {formattedAmount}</p>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleDownload}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        Descargar boleta
                    </button>
                    <button
                        onClick={() => navigate("/payroll")}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        ← Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PayrollDetail;
