export interface NewsItem {
    id: string
    title: string
    date: string
    content: string
}

// 👇 Esto es un ancla para que TypeScript no lo trate como solo tipo
export const __ensureImportableNewsItem = true
