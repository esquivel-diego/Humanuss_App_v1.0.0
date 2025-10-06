import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { RectangleProps } from "recharts"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@store/authStore"
import { useAttendanceStore } from "@store/attendanceStore"

interface AttendanceBar {
  name: string
  minutes?: number   // opcional: no dibuja barra si no hay check-in
  label: string
}

const AttendanceCard = () => {
  const [chartData, setChartData] = useState<AttendanceBar[]>([])
  const [min, setMin] = useState(420) // 07:00
  const [max, setMax] = useState(660) // 11:00
  const [avgTime24h, setAvgTime24h] = useState("00:00") // HH:MM 24h
  const [avgMeridian, setAvgMeridian] = useState<"A.M" | "P.M">("A.M")

  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const getWeek = useAttendanceStore((state) => state.getWeek)
  const fetchWeek = useAttendanceStore((state) => state.fetchWeek)

  const parseToMinutes = (time: string) => {
    if (!time) return NaN
    const [h, m] = time.split(":").map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return NaN
    return h * 60 + m
  }

  const formatHour = (m: number) => {
    if (Number.isNaN(m)) return "--:--"
    const h = Math.floor(m / 60)
    const min = m % 60
    return `${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`
  }

  const toMeridian = (hhmm: string): "A.M" | "P.M" => {
    const [hStr] = hhmm.split(":")
    const h = Number(hStr)
    // 0..11 => AM ; 12..23 => PM (12:xx es mediodía = P.M)
    return h >= 12 ? "P.M" : "A.M"
  }

  const to12h = (hhmm: string): string => {
    const [hStr, mStr] = hhmm.split(":")
    let h = Number(hStr)
    const m = Number(mStr)
    if (Number.isNaN(h) || Number.isNaN(m)) return "--:--"
    const h12 = h % 12 || 12
    return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`
  }

  const CustomBar = (props: RectangleProps) => {
    const { x, y, width, height, fill } = props
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
    )
  }

  useEffect(() => {
    if (!user) return
    // Semana ACTUAL lunes→domingo (v2) para reflejar marcajes de hoy
    fetchWeek(user)
  }, [user, fetchWeek])

  useEffect(() => {
    if (!user) return
    const attendance = getWeek(user.id)
    if (!Array.isArray(attendance) || attendance.length === 0) return

    // Tomar SOLO días con check-in válido (hora local ya viene desde el service)
    const checkIns = attendance
      .map((d) => parseToMinutes(d.checkIn || ""))
      .filter((m) => !Number.isNaN(m))

    if (checkIns.length === 0) return

    const adjustedMin = Math.min(...checkIns) - 15 // regla aprobada
    const adjustedMax = Math.max(...checkIns)

    const parsed: AttendanceBar[] = attendance.map((d) => {
      const mins = parseToMinutes(d.checkIn || "")
      return {
        name: d.day.slice(0, 3),                       // "Lun", "Mar", ...
        minutes: Number.isNaN(mins) ? undefined : mins, // no barra si sin hora
        label: d.checkIn || "--:--",
      }
    })

    const avgMins = Math.round(checkIns.reduce((a, b) => a + b, 0) / checkIns.length)
    const avgHHMM = formatHour(avgMins)     // 24h
    const meridian = toMeridian(avgHHMM)    // A.M / P.M

    setAvgTime24h(avgHHMM)
    setAvgMeridian(meridian)
    setChartData(parsed)
    setMin(adjustedMin)
    setMax(adjustedMax)
  }, [user, getWeek])

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
            {to12h(avgTime24h)} {avgMeridian}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AttendanceCard
