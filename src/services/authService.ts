import users from '../mocks/users.json'

export type User = {
  id: number
  name: string
  role: 'admin' | 'employee'
}

export const loginWithMock = (username: string, password: string): User => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) throw new Error('Credenciales incorrectas')

  // Aseguramos el type casting correcto
  return {
    id: user.id,
    name: user.name,
    role: user.role as 'admin' | 'employee'
  }
}
