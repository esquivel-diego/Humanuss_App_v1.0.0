import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const CHECK_IN_KEY = "checkInTime";

const CheckInCard = () => {
    const [time, setTime] = useState<string | null>(null);

    const formatTime = (date: Date) => {
        const h = date.getHours();
        const m = date.getMinutes();
        const hour = h % 12 || 12;
        const meridian = h < 12 ? "A.M" : "P.M";
        return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${meridian}`;
    };

    const checkStatus = (t: string | null) => {
        if (!t) return "PENDING";
        const [h, m] = t.split(":").map(Number);
        const total = h * 60 + m;
        return total <= 480 ? "ON-TIME" : "LATE";
    };

    const handleCheckIn = () => {
        const now = new Date();
        const raw = `${now.getHours()}:${now.getMinutes()}`;
        const formatted = formatTime(now);
        localStorage.setItem(CHECK_IN_KEY, raw);
        setTime(formatted);
        window.dispatchEvent(new Event("checkInUpdated"));
    };

    useEffect(() => {
        const stored = localStorage.getItem(CHECK_IN_KEY);
        if (stored) {
            const [h, m] = stored.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m);
            setTime(formatTime(d));
        }
    }, []);

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
