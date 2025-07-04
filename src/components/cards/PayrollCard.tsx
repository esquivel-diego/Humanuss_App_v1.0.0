import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import payrollData from '@mocks/payroll.json';

interface Payment {
  amount: number;
  date: string;
  downloadUrl?: string;
  earnings: { label: string; amount: number }[];
  deductions: { label: string; amount: number }[];
}

interface PayrollEntry {
  userId: number;
  payments: Payment[];
}

const PayrollCard = () => {
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

useEffect(() => {
  console.log("🚀 USER:", user)
  const userData: PayrollEntry | undefined = (payrollData as PayrollEntry[]).find(
    (entry) => entry.userId === user?.id
  );
  console.log("📊 USER DATA:", userData)

  if (userData?.payments?.length) {
    const sorted = [...userData.payments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    console.log("💰 LAST PAYMENT:", sorted[0])
    setLastPayment(sorted[0]);
  } else {
    setLastPayment(null);
  }
}, [user]);


  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString('es-ES', { month: 'long' }).toUpperCase();
    return {
      year: date.getFullYear(),
      month,
      quincena: date.getDate() <= 15 ? 'PRIMERA QUINCENA' : 'SEGUNDA QUINCENA',
    };
  };

  if (!lastPayment) return null;

  const { year, month, quincena } = formatMonth(lastPayment.date);

  return (
    <div
      onClick={() => navigate('/payroll')}
      className="card-bg rounded-2xl shadow px-10 py-4 cursor-pointer hover:ring-2 hover:ring-blue-500 transition h-full"
    >
      <div className="flex flex-col justify-center h-full">
        <div className="flex justify-between items-center text-left">
          <div>
            <p className="text-xs text-gray-500">{year}</p>
            <p className="text-md font-bold text-gray-800 dark:text-white">{month}</p>
            <p className="text-xs text-gray-500">{quincena}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              Q{Number(lastPayment.amount).toLocaleString('es-GT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollCard;
