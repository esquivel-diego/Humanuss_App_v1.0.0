import { useParams, Link } from 'react-router-dom'
import newsData from '@mocks/news.json'
import type { NewsItem } from '../../types/News'
import { ArrowLeft } from 'lucide-react'




const NewsDetail = () => {
    const { id } = useParams()
    const newsItem = newsData.find((n: NewsItem) => n.id === id)

    if (!newsItem) return <div className="p-4">Noticia no encontrada</div>

    return (
        <div className="p-4">

            <Link
                to="/modules/novedades"
                className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-lg"
                aria-label="Volver a novedades"
            >
                <ArrowLeft className="w-6 h-6 text-white" />
            </Link>

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{newsItem.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {new Date(newsItem.date).toLocaleDateString('es-ES', {
                    year: 'numeric', month: 'long', day: 'numeric'
                })}
            </p>
            <p className="text-gray-700 dark:text-gray-300">{newsItem.content}</p>
        </div>
    )
}

export default NewsDetail
