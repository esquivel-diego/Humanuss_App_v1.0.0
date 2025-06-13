// src/components/cards/PayrollCard.tsx
/**
 * Card que muestra pagos recientes y permite descargar una boleta en PDF.
 * Simula la información de la nómina.
 */

import jsPDF from "jspdf";

const PayrollCard = () => {
    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text("Boleta de Pago", 20, 20);
        doc.text("Empleado: Diego Esquivel", 20, 30);
        doc.text("Sueldo: Q8,000", 20, 40);
        doc.save("boleta_pago.pdf");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Nómina</h2>
            <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                <li>Pago: Q8,000 - 2025-05-31</li>
                <li>Pago: Q8,000 - 2025-04-30</li>
            </ul>
            <button
                onClick={handleDownload}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Descargar boleta PDF
            </button>
        </div>
    );
};

export default PayrollCard;
