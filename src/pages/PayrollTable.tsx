// src/pages/PayrollTable.tsx

import { useEffect, useState } from "react";
import data from "@mocks/payroll.json";

interface Payment {
    amount: number;
    date: string;
}

const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("es-ES", { month: "long" }).toUpperCase();
    const year = date.getFullYear();
    const quincena = date.getDate() <= 15 ? "PRIMERA QUINCENA" : "SEGUNDA QUINCENA";
    return { month, year, quincena };
};

const PayrollTable = () => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        setPayments(data.payments);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Boletas de Pago</h1>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-2xl">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-left">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Mes</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Quincena</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Año</th>
                            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">Monto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {payments.map((payment, i) => {
                            const { month, year, quincena } = formatMonth(payment.date);
                            return (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PayrollTable;
