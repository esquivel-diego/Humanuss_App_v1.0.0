import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import AttendanceTable from '../pages/AttendanceTable'
import DaysTable from '../pages/DaysTable'
import PayrollTable from '../pages/PayrollTable'
import PayrollDetail from '../pages/PayrollDetail'
import Settings from '../pages/Settings'
import AppLayout from '../layouts/AppLayout'
import Modules from '../pages/Modules'


const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas dentro del layout */}
            <Route
                element={
                    <PrivateRoute>
                        <AppLayout />
                    </PrivateRoute>
                }
            >
                <Route path="/" element={<Dashboard />} />
                <Route path="/attendance" element={<AttendanceTable />} />
                <Route path="/days" element={<DaysTable />} />
                <Route path="/payroll" element={<PayrollTable />} />
                <Route path="/payroll/:index" element={<PayrollDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/modules" element={<Modules />} />

            </Route>

        </Routes>
    </BrowserRouter>
)

export default AppRouter
