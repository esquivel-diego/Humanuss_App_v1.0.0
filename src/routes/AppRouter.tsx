import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import AttendanceTable from '../pages/AttendanceTable';
import DaysTable from '../pages/DaysTable';
import PayrollTable from '../pages/PayrollTable';
import PayrollDetail from '../pages/PayrollDetail'; // 🆕

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/attendance" element={<PrivateRoute><AttendanceTable /></PrivateRoute>} />
            <Route path="/days" element={<PrivateRoute><DaysTable /></PrivateRoute>} />
            <Route path="/payroll" element={<PrivateRoute><PayrollTable /></PrivateRoute>} />
            <Route path="/payroll/:index" element={<PrivateRoute><PayrollDetail /></PrivateRoute>} /> {/* 🆕 */}
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
