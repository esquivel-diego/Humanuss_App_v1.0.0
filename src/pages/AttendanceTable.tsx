import { useEffect, useState } from "react";
import data from "@mocks/attendance.json";

interface DayEntry {
    day: string;
    checkIn: string;
    checkOut: string;
}

const parseToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

const AttendanceTable = () => {
    const [week, setWeek] = useState<DayEntry[]>([]);

    useEffect(() => {
        setWeek(data.week);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
                    Historial de Asistencia
                </div>

                <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow rounded-2xl">
                    <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Día
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Check-In
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Check-Out
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {week.map((entry, i) => {
                                const checkInMin = parseToMinutes(entry.checkIn);
                                const status = checkInMin <= 480 ? "ON-TIME" : "LATE";
                                const statusColor =
                                    status === "ON-TIME"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800";

                                return (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <td className="px-6 py-4 text-sm font-medium">{entry.day}</td>
                                        <td className="px-6 py-4 text-sm">{entry.checkIn}</td>
                                        <td className="px-6 py-4 text-sm">{entry.checkOut}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;
