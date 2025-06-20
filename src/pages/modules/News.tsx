import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNewsStore } from '@store/newsStore'

const News = () => {
  const { news, loadFromStorage } = useNewsStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <div className="w-full px-4 py-6 max-w-4xl mx-auto">
      <div className="bg-blue-900 text-white p-4 rounded-2xl text-lg font-bold mb-6 shadow">
        Novedades
      </div>
      <div className="flex flex-col gap-6">
        
        {news.map((news) => (
          <Link
            to={`/novedades/${news.id}`}
            key={news.id}
            className="block w-full card-bg rounded-2xl p-6 shadow-xl transition hover:brightness-95"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(news.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            <h3 className="text-md font-bold mt-1 text-gray-800 dark:text-white line-clamp-1">
              {news.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {news.content}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default News
