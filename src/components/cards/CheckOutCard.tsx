import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const CHECK_OUT_KEY = "checkOutTime";

const CheckOutCard = () => {
    const [time, setTime] = useState<string | null>(null);

    const formatTime = (date: Date) => {
        const h = date.getHours();
        const m = date.getMinutes();
        const hour = h % 12 || 12;
        const meridian = h < 12 ? "A.M" : "P.M";
        return `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${meridian}`;
    };

    const handleCheckOut = () => {
        const now = new Date();
        const raw = `${now.getHours()}:${now.getMinutes()}`;
        const formatted = formatTime(now);
        localStorage.setItem(CHECK_OUT_KEY, raw);
        setTime(formatted);
        window.dispatchEvent(new Event("checkOutUpdated"));
    };

    useEffect(() => {
        const stored = localStorage.getItem(CHECK_OUT_KEY);
        if (stored) {
            const [h, m] = stored.split(":").map(Number);
            const d = new Date();
            d.setHours(h, m);
            setTime(formatTime(d));
        }
    }, []);

    return (
        <div
            onClick={handleCheckOut}
            style={{ backgroundColor: "rgba(0,123,255,0.08)" }}
            className="rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition flex flex-col items-center justify-center h-32 w-full"
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
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 tracking-wide uppercase mt-1">
                {time ? "CHECKED" : "PENDING"}
            </div>
        </div>
    );
};

export default CheckOutCard;
