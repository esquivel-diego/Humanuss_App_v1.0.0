// src/pages/Notifications.tsx
import { useEffect } from 'react'
import { useNotificationStore } from '@store/notificationStore'
import { useAuthStore } from '@store/authStore'

const Notifications = () => {
  const user = useAuthStore((state) => state.user)
const { notifications, loadFromStorage, markAsRead } = useNotificationStore()

useEffect(() => {
  loadFromStorage()
}, [loadFromStorage])



  const userNotifications = notifications.filter(n => n.userId === user?.id)

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-blue-900 text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow mb-6">
          Notificaciones
        </div>

        <div className="card-bg p-6 rounded-2xl shadow-lg space-y-4">
          {userNotifications.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No tienes notificaciones por el momento.</p>
          ) : (
            userNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 rounded-xl border transition cursor-pointer ${
                  n.read
                    ? 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                    : 'border-blue-400 bg-blue-50 dark:bg-gray-700'
                }`}
              >
                <div>
                  <p className="font-medium">{n.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <span className="ml-4 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    NUEVA
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
