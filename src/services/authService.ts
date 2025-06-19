import users from '../mocks/users.json'

export type User = {
  id: number
  name: string
  username: string
  role: 'admin' | 'employee'
  token: string
}

type RawUser = {
  id: number
  name: string
  username: string
  password: string
  role: string
}

export const loginWithMock = (username: string, password: string): User => {
  const user = (users as RawUser[]).find(
    (u) => u.username === username && u.password === password
  )

  if (!user) throw new Error('Credenciales incorrectas')

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role as 'admin' | 'employee',
    token: 'mock-token'
  }
}
