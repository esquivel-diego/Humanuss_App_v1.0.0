import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { loginWithMock, type User } from '@services/authService'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña')
      return
    }

    try {
      const user: User = loginWithMock(username.trim(), password.trim())
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-sm p-6 rounded-2xl shadow-md card-bg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="src/assets/logo.svg"
            alt="Logo"
            className="h-16"
          />
        </div>

        {/* Título */}
        <h2 className="text-center text-xl font-semibold mb-6">
          Log In
        </h2>

        {/* Error */}
        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm mb-3 text-center">
            {error}
          </div>
        )}

        {/* Usuario */}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />

        {/* Contraseña con mostrar/ocultar */}
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 dark:text-gray-300"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Botón INGRESAR */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>

        {/* Separador visual */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-sm text-gray-500 dark:text-gray-400">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Botón SSO simulado */}
        <button
          onClick={() => alert('SSO no disponible en el MVP')}
          className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          SSO
        </button>
      </div>
    </div>
  )
}
