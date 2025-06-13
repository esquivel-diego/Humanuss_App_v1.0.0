// src/components/cards/AttendanceCard.tsx
/**
 * Card que muestra una tabla de asistencia semanal.
 * En el futuro puede incluir una gráfica con una librería.
 */

const AttendanceCard = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Asistencia Semanal</h2>
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="pb-2">Día</th>
                        <th className="pb-2">Entrada</th>
                        <th className="pb-2">Salida</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Lunes</td>
                        <td>08:00</td>
                        <td>17:00</td>
                    </tr>
                    <tr>
                        <td>Martes</td>
                        <td>08:15</td>
                        <td>17:05</td>
                    </tr>
                    <tr>
                        <td>Miércoles</td>
                        <td>08:05</td>
                        <td>17:00</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceCard;
