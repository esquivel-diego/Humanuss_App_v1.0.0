// @components/cards/AttendanceCard.tsx

import { useEffect, useState } from 'react';
import data from '@mocks/attendance.json';

interface DayRecord {
    day: string;
    checkIn: string;
    checkOut: string;
}

const AttendanceCard = () => {
    const [weekData, setWeekData] = useState<DayRecord[]>([]);

    useEffect(() => {
        // Simula fetch local
        setWeekData(data.week);
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Asistencia Semanal</h2>
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="pb-2">Día</th>
                        <th className="pb-2">Entrada</th>
                        <th className="pb-2">Salida</th>
                    </tr>
                </thead>
                <tbody>
                    {weekData.map((d, i) => (
                        <tr key={i}>
                            <td>{d.day}</td>
                            <td>{d.checkIn}</td>
                            <td>{d.checkOut}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceCard;
