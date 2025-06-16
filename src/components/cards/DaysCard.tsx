import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '@mocks/days.json';

interface Request {
  date: string;
  type: string;
  status: string;
}

const DaysCard = () => {
  const [availableDays, setAvailableDays] = useState<number>(0);
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setAvailableDays(data.availableDays);
    setRequests(data.requests);
  }, []);

  const totalDays = 15;
  const takenDays = totalDays - availableDays;
  const lastStatus = requests[0]?.status || 'N/A';
  const isApproved =
    lastStatus.toLowerCase() === 'aprobado' || lastStatus.toLowerCase() === 'approved';

return (
  <div
    onClick={() => navigate('/days')}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
  >
    <h2 className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase mb-4">
      DÍAS DISPONIBLES
    </h2>

    {/* Títulos */}
    <div className="grid grid-cols-3 text-center mb-1">
      <span className="text-xs text-gray-500 uppercase">Tomados</span>
      <span className="text-xs text-gray-500 uppercase">Disponibles</span>
      <span className="text-xs text-gray-500 uppercase whitespace-nowrap">Último estatus</span>
    </div>

    {/* Valores */}
    <div className="grid grid-cols-3 text-center items-center">
      <span className="text-2xl font-bold text-gray-800 dark:text-white">
        {takenDays.toString().padStart(2, '0')}
      </span>
      <span className="text-2xl font-bold text-gray-800 dark:text-white">
        {availableDays.toString().padStart(2, '0')}
      </span>
      <span
        className={`inline-block text-xs font-semibold px-4 py-1 rounded-full ${
          isApproved
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {lastStatus.toUpperCase()}
      </span>
    </div>
  </div>
);
};

export default DaysCard;
