// src/services/adminService.ts
import { fetchJson } from '@utils/apiClient'

export const getAdminIds = async (): Promise<string[]> => {
  // Flag opcional para reactivar backend local cuando quieras
  const useLocal = (import.meta as any).env?.VITE_USE_LOCAL_ADMIN === 'true'
  if (!useLocal) {
    return []
  }

  try {
    const res = await fetchJson('/admin-users', {
      skipToken: true,
      forceLocal: true,
    })
    return Array.isArray(res?.ids) ? (res.ids as string[]) : []
  } catch {
    // Silenciar errores si el backend local no está corriendo
    return []
  }
}
