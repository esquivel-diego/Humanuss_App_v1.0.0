// src/components/cards/CheckOutCard.tsx
/**
 * Card que permite al usuario registrar su salida (check-out).
 * Depende de haber hecho el check-in primero.
 */

import { useState } from "react";

const CheckOutCard = () => {
    const [checkedOut, setCheckedOut] = useState(false);

    const handleCheckOut = () => {
        setCheckedOut(true);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Check-Out</h2>
            <p className="text-sm mb-4">
                Estado:{" "}
                <span className={checkedOut ? "text-green-600" : "text-red-500"}>
                    {checkedOut ? "Registrado" : "Pendiente"}
                </span>
            </p>
            {!checkedOut && (
                <button
                    onClick={handleCheckOut}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                    Marcar salida
                </button>
            )}
        </div>
    );
};

export default CheckOutCard;
