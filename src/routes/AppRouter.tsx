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
import Profile from '../pages/Profile'
import LeaveRequest from '../pages/modules/LeaveRequest'
import Absences from '../pages/modules/Absences'
import HRRequests from '../pages/modules/HRRequests'
import News from '../pages/modules/News'
import NewsDetail from '../pages/modules/NewsDetail'



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
                <Route path="/profile" element={<Profile />} />
                <Route path="/modules/vacaciones" element={<LeaveRequest />} />
                <Route path="/modules/ausencias" element={<Absences />} />
                <Route path="/modules/solicitudes" element={<HRRequests />} />
                <Route path="/modules/novedades" element={<News />} />
                <Route path="/novedades/:id" element={<NewsDetail />} />
            </Route>

        </Routes>
    </BrowserRouter>
)

export default AppRouter
