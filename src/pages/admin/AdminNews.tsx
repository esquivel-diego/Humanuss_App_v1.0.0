import { useState, useEffect } from 'react'
import { useNewsStore } from '@store/newsStore'
import { useNotificationStore } from '@store/notificationStore'
import users from '@mocks/users.json'

const AdminNews = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { news, addNews, loadFromStorage } = useNewsStore()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    loadFromStorage()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('Por favor completa todos los campos.')
      return
    }

    // Crear noticia (sin pasar id ni date, el store lo maneja)
    addNews({ title, content })

    // Generar un ID manualmente para vincular notificaciones
    const simulatedId = Date.now()

    // Enviar notificación a todos los usuarios con link estimado
    users.forEach((user) => {
      addNotification({
        userId: user.id,
        message: `📰 Nueva noticia publicada: "${title}"`,
        date: new Date().toISOString(),
        read: false,
        link: `/novedades/${simulatedId}`,
      })
    })

    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setTitle('')
    setContent('')
  }

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-2">Publicar Noticias</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Crea y publica anuncios internos visibles para todos los colaboradores.
      </p>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-semibold mb-1">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Contenido</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-28 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 resize-none focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition"
        >
          Publicar
        </button>

        {submitted && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✅ Noticia publicada correctamente.
          </div>
        )}
      </form>

      {/* Lista de noticias existentes */}
      {news.length > 0 && (
        <div className="mt-10 max-w-3xl">
          <h2 className="text-lg font-bold mb-3">Noticias publicadas</h2>
          <ul className="space-y-4">
            {news
              .slice()
              .reverse()
              .map((item) => (
                <li key={item.id} className="p-4 rounded-lg card-bg shadow">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {item.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    Publicado el {new Date(item.date).toLocaleString('es-ES')}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AdminNews
