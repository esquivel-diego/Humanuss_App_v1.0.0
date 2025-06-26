export const getStoredToken = (): string | null => {
  return localStorage.getItem('TOKENLOG') ?? null
}
