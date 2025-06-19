import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { useAttendanceStore } from "@store/attendanceStore";

const CheckInCard = () => {
  const [time, setTime] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const markCheckIn = useAttendanceStore((state) => state.markCheckIn);
  const getWeek = useAttendanceStore((state) => state.getWeek);

  const formatTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const hour = h % 12 || 12;
    const meridian = h < 12 ? "A.M" : "P.M";
    return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${meridian}`;
  };

  const getCurrentDayName = () =>
    new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(new Date());

  const getRawTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const checkStatus = (t: string | null) => {
    if (!t) return "PENDIENTE";
    const [h, m] = t.split(":").map(Number);
    const total = h * 60 + m;
    return total <= 480 ? "ON-TIME" : "LATE";
  };

  const handleCheckIn = () => {
    if (!user) return;

    const now = new Date();
    const formatted = formatTime(now);
    const raw = getRawTime();
    const today = capitalize(getCurrentDayName());

    markCheckIn(user.id, today, raw);
    setTime(formatted);
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => {
    if (!user) return;
    const today = capitalize(getCurrentDayName());
    const todayData = getWeek(user.id).find((d) => d.day === today);
    if (todayData?.checkIn) {
      const [h, m] = todayData.checkIn.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m);
      setTime(formatTime(d));
    }
  }, [user, getWeek]);

  return (
    <div
      onClick={handleCheckIn}
      className="card-bg rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition flex flex-col items-center justify-center h-32 w-full"
    >
      <div className="flex items-center justify-between w-full text-xs text-black dark:text-white font-semibold">
        <span>CHECK-IN</span>
        <ArrowUpRight size={16} className="text-gray-400 hover:text-blue-500 transition" />
      </div>
      <div className="text-2xl font-bold text-black dark:text-white mt-2">
        {time ? time : "--:--"}
      </div>
      <div className="text-xs text-center text-gray-500 dark:text-gray-400 tracking-wide uppercase mt-1">
        {checkStatus(time)}
      </div>
    </div>
  );
};

export default CheckInCard;
