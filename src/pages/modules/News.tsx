import { Link } from 'react-router-dom'
import newsData from '@mocks/news.json'
import type { NewsItem } from '../../types/News'

/**
 * Página de listado de novedades
 * Muestra todas las noticias del sistema con enlaces al detalle
 */
const News = () => {
    return (
        <div className="px-4 max-w-3xl mx-auto">
            {/* Título principal */}
            <div className="bg-blue-900 text-white p-4 rounded-2xl mb-6 text-lg font-bold">
                Novedades
            </div>

            {/* Lista de noticias con espaciado uniforme */}
            <div className="space-y-6">
                {newsData.map((news: NewsItem) => (
                    <div key={news.id}>
                        <Link
                            to={`/novedades/${news.id}`}
                            className="block bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition"
                        >
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(news.date).toLocaleDateString('es-ES', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                            <h3 className="text-md font-bold mt-1 text-gray-800 dark:text-white">
                                {news.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 truncate">{news.content}</p>
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default News
