import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { RectangleProps } from "recharts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/authStore";
import { getWeeklyAttendance } from "@services/attendanceService";

interface AttendanceBar {
  name: string;
  minutes: number;
  label: string;
}

const AttendanceCard = () => {
  const [chartData, setChartData] = useState<AttendanceBar[]>([]);
  const [min, setMin] = useState(420); // 07:00
  const [max, setMax] = useState(660); // 11:00
  const [avgTime, setAvgTime] = useState("00:00");

  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const parseToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const formatHour = (m: number) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  };

  const CustomBar = (props: RectangleProps) => {
    const { x, y, width, height, fill } = props;
    return (
      <rect
        x={x! + (width! - 20) / 2}
        y={y!}
        width={20}
        height={height!}
        fill={fill}
        rx={4}
        ry={4}
      />
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const attendance = await getWeeklyAttendance();

        if (!Array.isArray(attendance)) {
          throw new Error("Respuesta inesperada del servidor");
        }

        const checkIns = attendance
          .map((d) => parseToMinutes(d.checkIn))
          .filter((m) => !isNaN(m)); // Evita NaN

        if (checkIns.length === 0) return;

        const adjustedMin = Math.min(...checkIns) - 15;
        const adjustedMax = Math.max(...checkIns);

        const parsed: AttendanceBar[] = attendance.map((d) => ({
          name: d.day.slice(0, 3),
          minutes: parseToMinutes(d.checkIn),
          label: d.checkIn,
        }));

        const avg = Math.round(
          checkIns.reduce((a, b) => a + b, 0) / checkIns.length
        );

        setAvgTime(formatHour(avg));
        setChartData(parsed);
        setMin(adjustedMin);
        setMax(adjustedMax);
      } catch (err) {
        console.error("Error al cargar asistencia:", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div
      onClick={() => navigate("/attendance")}
      className="card-bg rounded-2xl shadow px-8 py-6 flex flex-col gap-8 cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
    >
      <h2 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase text-center w-full">
        Asistencia semanal
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
        <div className="w-full max-w-[300px] h-64 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barCategoryGap={1}
              margin={{ top: 10, bottom: 30, left: 10, right: 0 }}
            >
              <YAxis
                type="number"
                domain={[min, max]}
                tickFormatter={formatHour}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatHour(value as number)}
                labelStyle={{ color: "#555" }}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="minutes"
                shape={<CustomBar />}
                isAnimationActive={false}
                activeBar={false}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#3b82f6" : "#ec4899"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center md:text-left w-full md:w-1/3">
          <p className="text-xs text-gray-500 uppercase mb-1">Promedio</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
            {avgTime} A.M
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;
