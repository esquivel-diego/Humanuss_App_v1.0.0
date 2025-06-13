// src/components/cards/CheckInCard.tsx
/**
 * Card que permite al usuario registrar su entrada (check-in).
 * Simula la lógica sin conexión real a backend.
 */

import { useState } from "react";

const CheckInCard = () => {
    const [checkedIn, setCheckedIn] = useState(false);

    const handleCheckIn = () => {
        setCheckedIn(true);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Check-In</h2>
            <p className="text-sm mb-4">
                Estado:{" "}
                <span className={checkedIn ? "text-green-600" : "text-red-500"}>
                    {checkedIn ? "Registrado" : "Pendiente"}
                </span>
            </p>
            {!checkedIn && (
                <button
                    onClick={handleCheckIn}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Marcar entrada
                </button>
            )}
        </div>
    );
};

export default CheckInCard;
