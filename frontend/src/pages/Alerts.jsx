import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAlerts } from '../services/api'
import BottomNav from '../components/BottomNav'
import MapComponent from '../components/MapComponent'

export default function Alerts() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login')
    getAlerts()
      .then(res => {
        setAlerts(res.data?.length ? res.data : [
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned near IT Park, Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false, latitude: 10.3291, longitude: 123.9061 },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ])
      })
      .catch(() => {
        setAlerts([
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned near IT Park, Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false, latitude: 10.3291, longitude: 123.9061 },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleViewLocation = (lat, lng) => {
    setSelectedLocation({ lat, lng })
    setShowMap(true)
  }

  return (
    <div className="bg-surface min-h-screen pb-32 selection:bg-primary-container selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container/30 soft-shadow h-[72px] flex items-center">
        <div className="flex justify-between items-center px-6 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-2xl font-serif-elegant font-bold text-on-surface flex items-center gap-2 group transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pets</span>
            <span className="text-gradient">PetConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-primary-container border border-primary/20 text-primary font-bold text-sm shadow-sm">
              {user.name?.charAt(0) || 'U'}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-[112px] px-6 max-w-3xl mx-auto">
        {/* Title */}
        <section className="mb-8 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-[28px] font-semibold text-on-surface tracking-tight leading-tight">
            Notification <span className="text-gradient">Center</span>
          </h1>
          <p className="text-sm text-on-surface-variant font-normal mt-2">Stay informed about your pet's safety and health.</p>
        </section>

        {/* Map Modal */}
        {showMap && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowMap(false)}></div>
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
              <div className="p-5 border-b border-surface-container flex justify-between items-center">
                <h3 className="text-lg font-semibold">Scan Location</h3>
                <button onClick={() => setShowMap(false)} className="w-9 h-9 rounded-full hover:bg-surface-container transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="h-[400px] relative">
                <MapComponent lat={selectedLocation?.lat} lng={selectedLocation?.lng} />
              </div>
              <div className="p-4 bg-surface-container-low/30 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">Cebu City, Philippines</p>
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {loading ? (
          <div className="flex justify-center py-32">
            <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-32 premium-card bg-surface-container-low/30 border-dashed rounded-2xl">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/30 mx-auto mb-6">
              <span className="material-symbols-outlined text-4xl">notifications_off</span>
            </div>
            <p className="text-lg font-semibold text-on-surface mb-2">Quiet for now</p>
            <p className="text-sm text-on-surface-variant font-normal max-w-xs mx-auto">When your pet's tag is scanned or reminders are due, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-3 relative before:absolute before:left-[21.5px] before:top-4 before:bottom-4 before:w-[1px] before:bg-surface-container/50">
            {alerts.map(alert => (
              <div key={alert.id} className="relative pl-16 group">
                {/* Timeline Dot Icon Box */}
                <div className={`absolute left-0 top-1 w-11 h-11 rounded-xl flex items-center justify-center z-10 shadow-sm transition-all duration-300 group-hover:scale-110 ${alert.type === 'scan' ? 'bg-error text-white' : 'bg-primary text-on-primary'}`}>
                  <span className="material-symbols-outlined text-[20px]">{alert.type === 'scan' ? 'location_on' : 'vaccines'}</span>
                </div>
                
                <div className={`premium-card py-4 px-5 rounded-2xl border ${!alert.is_read ? 'bg-white border-primary/20' : 'bg-white/60 border-surface-container/50 opacity-80'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="pr-12">
                       <h3 className={`text-[15px] font-semibold transition-colors ${!alert.is_read ? 'text-on-surface' : 'text-on-surface-variant'}`}>{alert.title}</h3>
                       <p className="text-[13px] text-on-surface-variant font-normal leading-relaxed mt-1">{alert.message}</p>
                    </div>
                    <span className="absolute top-4 right-5 text-12px font-normal text-on-surface-variant/50 bg-surface-container-low/50 px-2 py-0.5 rounded-full">
                       {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3 flex gap-4">
                     {!alert.is_read && <button className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary hover:underline">Mark as read</button>}
                     {alert.type === 'scan' && (
                       <button 
                        onClick={() => handleViewLocation(alert.latitude, alert.longitude)}
                        className="text-[11px] font-semibold uppercase tracking-[0.06em] text-secondary hover:underline"
                       >
                         View Location
                       </button>
                     )}
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
        className="fixed right-6 bottom-[42px] w-[52px] h-[52px] bg-brown-gradient text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:rotate-90 active:scale-95 transition-all z-60 group"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
