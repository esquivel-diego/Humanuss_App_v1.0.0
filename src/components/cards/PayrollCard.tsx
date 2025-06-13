// @components/cards/PayrollCard.tsx

import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import payrollData from '@mocks/payroll.json';

interface Payment {
    amount: number;
    date: string;
}

const PayrollCard = () => {
    const [employee, setEmployee] = useState('');
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        // Simula fetch de datos
        setEmployee(payrollData.employee);
        setPayments(payrollData.payments);
    }, []);

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text("Boleta de Pago", 20, 20);
        doc.text(`Empleado: ${employee}`, 20, 30);
        doc.text(`Sueldo: Q${payments[0].amount}`, 20, 40);
        doc.save("boleta_pago.pdf");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Nómina</h2>
            <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                {payments.map((p, index) => (
                    <li key={index}>Pago: Q{p.amount} - {p.date}</li>
                ))}
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
