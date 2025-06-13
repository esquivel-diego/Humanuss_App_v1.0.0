import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AppLayout from '../layouts/AppLayout'
import PrivateRoute from './PrivateRoute'

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <AppLayout>
                                <Home />
                            </AppLayout>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}
