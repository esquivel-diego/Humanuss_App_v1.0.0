import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@store/authStore";
import { useAttendanceStore } from "@store/attendanceStore";

const CheckOutCard = () => {
  const [time, setTime] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const markCheckOut = useAttendanceStore((state) => state.markCheckOut);
  const getWeek = useAttendanceStore((state) => state.getWeek);

  const formatTime = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const hour = h % 12 || 12;
    const meridian = h < 12 ? "A.M" : "P.M";
    return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${meridian}`;
  };

  const getRawTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const getCurrentDayName = () =>
    new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(new Date());

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleCheckOut = () => {
    if (!user) return;
    const now = new Date();
    const raw = getRawTime();
    const formatted = formatTime(now);
    const today = capitalize(getCurrentDayName());

    markCheckOut(user.id, today, raw);
    setTime(formatted);
  };

  useEffect(() => {
    if (!user) return;
    const today = capitalize(getCurrentDayName());
    const todayData = getWeek(user.id).find((d) => d.day === today);
    if (todayData?.checkOut) {
      const [h, m] = todayData.checkOut.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m);
      setTime(formatTime(d));
    }
  }, [user, getWeek]);

  const isMarked = !!time;

  return (
    <div
      onClick={handleCheckOut}
      className={`card-bg rounded-2xl shadow p-4 cursor-pointer transition flex flex-col items-center justify-center h-32 w-full
        ${isMarked ? "border-4 border-pink-500" : "hover:ring-2 hover:ring-blue-500"}`}
    >
      <div className="flex items-center justify-between w-full text-xs text-black dark:text-white font-semibold">
        <span>CHECK-OUT</span>
        <ArrowUpRight
          size={16}
          className="text-gray-400 hover:text-blue-500 transition rotate-180"
        />
      </div>
      <div className="text-2xl font-bold text-black dark:text-white mt-2">
        {time ? time : "--:--"}
      </div>
    </div>
  );
};

export default CheckOutCard;
