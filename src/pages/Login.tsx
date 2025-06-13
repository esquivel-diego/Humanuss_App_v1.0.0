import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const login = useAuthStore((state) => state.login)
    const navigate = useNavigate()

    const handleLogin = () => {
        login()
        navigate('/')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Login</h2>
                <input
                    type="text"
                    placeholder="Usuario"
                    className="w-full mb-2 p-2 border rounded"
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full mb-4 p-2 border rounded"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Ingresar
                </button>
            </div>
        </div>
    )
}
