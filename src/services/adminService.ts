import { fetchJson } from '@utils/apiClient'

export const getAdminIds = async (): Promise<string[]> => {
  const res = await fetchJson('/admin-users', {
    skipToken: true,        // 👈 necesario si tu fetchJson añade token
    forceLocal: true        // 👈 este es el que probablemente te falta
  })
  return res?.ids ?? []
}
