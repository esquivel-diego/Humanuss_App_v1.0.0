// @components/cards/DaysCard.tsx

import { useEffect, useState } from 'react';
import data from '@mocks/days.json';

interface Request {
    date: string;
    type: string;
    status: string;
}

const DaysCard = () => {
    const [availableDays, setAvailableDays] = useState<number>(0);
    const [requests, setRequests] = useState<Request[]>([]);

    useEffect(() => {
        // Simulación de fetch local
        setAvailableDays(data.availableDays);
        setRequests(data.requests);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Días Disponibles</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Tienes {availableDays} días disponibles.
            </p>

            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="pb-2">Fecha</th>
                        <th className="pb-2">Tipo</th>
                        <th className="pb-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((r, index) => (
                        <tr key={index}>
                            <td>{r.date}</td>
                            <td>{r.type}</td>
                            <td className={r.status === 'Aprobado' ? 'text-green-600' : 'text-yellow-500'}>
                                {r.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DaysCard;
