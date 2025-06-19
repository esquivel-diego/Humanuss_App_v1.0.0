import users from '../mocks/users.json'

export type User = {
  id: number
  name: string
  role: 'admin' | 'employee'
  username: string
  token: string
}

export const loginWithMock = (username: string, password: string): User => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  )
  if (!user) throw new Error('Credenciales incorrectas')

  return {
    id: user.id,
    name: user.name,
    role: user.role as 'admin' | 'employee',
    username: user.username,
    token: 'mock-token' // en el futuro: token real desde API
  }
}
