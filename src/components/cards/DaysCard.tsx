// src/components/cards/DaysCard.tsx
/**
 * Card que muestra los días disponibles de vacaciones o permisos,
 * y una tabla simulada de solicitudes recientes.
 */

const DaysCard = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Días Disponibles</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Tienes 12 días disponibles.
            </p>

            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
                <thead className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                        <th className="pb-2">Fecha</th>
                        <th className="pb-2">Tipo</th>
                        <th className="pb-2">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2025-06-03</td>
                        <td>Vacación</td>
                        <td className="text-green-600">Aprobado</td>
                    </tr>
                    <tr>
                        <td>2025-05-20</td>
                        <td>Permiso</td>
                        <td className="text-yellow-500">Pendiente</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DaysCard;
