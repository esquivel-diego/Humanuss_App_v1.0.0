// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
