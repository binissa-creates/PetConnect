import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAlerts } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function Alerts() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login')
    getAlerts()
      .then(res => {
        setAlerts(res.data?.length ? res.data : [
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned in Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ])
      })
      .catch(() => {
        setAlerts([
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned in Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">pets</span>
            PetConnect
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-primary">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/') }}
              className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/20 hover:bg-primary-container-high transition-colors"
            >
              {user.name?.charAt(0) || 'U'}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Title */}
        <section className="mb-10">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Alerts
          </h1>
          <p className="text-on-surface-variant font-medium">Stay updated on your pets' activities.</p>
        </section>

        {/* Alerts List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-6xl text-outline-variant">notifications_none</span>
            <p className="mt-4 text-on-surface-variant font-medium">No alerts yet. When your pet is scanned, you'll see it here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className={`bg-white p-6 rounded-lg border-l-4 shadow-sm transition-all ${alert.type === 'scan' ? 'border-primary' : 'border-secondary'}`}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${alert.type === 'scan' ? 'text-primary' : 'text-secondary'}`}>
                    <span className="material-symbols-outlined text-2xl">{alert.type === 'scan' ? 'qr_code_scanner' : 'vaccines'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-primary">{alert.title}</h3>
                        <p className="text-sm text-on-surface-variant">{alert.message}</p>
                      </div>
                      <span className="text-xs text-on-surface-variant whitespace-nowrap ml-4">{new Date(alert.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        to="/pet/new"
        className="fixed right-6 bottom-32 w-16 h-16 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 duration-200 z-40 hover:bg-primary-dim transition-colors"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
