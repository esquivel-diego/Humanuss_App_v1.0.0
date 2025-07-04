import { useAuthStore } from "@store/authStore";
import { useAttendanceStore } from "@store/attendanceStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import data from "@mocks/attendance.json";

interface DayEntry {
  day: string;
  checkIn: string;
  checkOut: string;
}

interface AttendanceEntry {
  userId: number;
  week: DayEntry[];
}

const parseToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const AttendanceTable = () => {
  const [week, setWeek] = useState<DayEntry[]>([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const getWeek = useAttendanceStore((state) => state.getWeek);

  useEffect(() => {
    if (!user) return;

    const userData = (data as AttendanceEntry[]).find(
      (d) => d.userId === user.id
    );

    if (!userData) return;

    const override = getWeek(user.id);
    const mergedWeek = userData.week.map((day) => {
      const overrideDay = override.find((o) => o.day === day.day);
      return {
        day: day.day,
        checkIn: overrideDay?.checkIn || day.checkIn,
        checkOut: overrideDay?.checkOut || day.checkOut,
      };
    });

    setWeek(mergedWeek);
  }, [user, getWeek]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6 relative">
      {/* Botón flotante de regreso */}
      <button
        onClick={() => navigate("/")}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
        aria-label="Volver"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Historial de Asistencia
        </div>

        <div className="overflow-x-auto card-bg shadow-xl rounded-2xl">
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
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{entry.day}</td>
                    <td className="px-6 py-4 text-sm">{entry.checkIn}</td>
                    <td className="px-6 py-4 text-sm">{entry.checkOut}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}
                      >
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
