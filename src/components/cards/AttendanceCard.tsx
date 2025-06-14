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
import data from "@mocks/attendance.json";

interface AttendanceBar {
    name: string;
    minutes: number;
    label: string;
}

const AttendanceCard = () => {
    const [chartData, setChartData] = useState<AttendanceBar[]>([]);
    const [min, setMin] = useState(420);
    const [max, setMax] = useState(660);
    const [avgTime, setAvgTime] = useState("00:00");

    const navigate = useNavigate();

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
        const checkIns = data.week.map((d) => parseToMinutes(d.checkIn));
        const adjustedMin = Math.min(...checkIns) - 15;
        const adjustedMax = Math.max(...checkIns);

        const parsed: AttendanceBar[] = data.week.map((d) => {
            const m = parseToMinutes(d.checkIn);
            return {
                name: d.day.slice(0, 3),
                minutes: m,
                label: d.checkIn,
            };
        });

        const avg = Math.round(checkIns.reduce((a, b) => a + b, 0) / checkIns.length);
        setAvgTime(formatHour(avg));
        setChartData(parsed);
        setMin(adjustedMin);
        setMax(adjustedMax);
    }, []);

    return (
        <div
            onClick={() => navigate("/attendance")}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 flex h-56 items-center justify-between cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
        >
            {/* Gráfico */}
            <div className="w-full h-full pr-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, bottom: 30, left: 10 }}
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
                        <Bar dataKey="minutes" shape={<CustomBar />} isAnimationActive={false}>
                            {chartData.map((_, i) => (
                                <Cell
                                    key={i}
                                    fill={i % 2 === 0 ? "#3b82f6" : "#ec4899"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Promedio alineado */}
            <div className="flex flex-col justify-center items-center pl-8 pr-10 w-28 text-center">
                <p className="text-xs text-gray-500 uppercase mb-1">Promedio</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                    {avgTime} A.M
                </p>
            </div>
        </div>
    );
};

export default AttendanceCard;
