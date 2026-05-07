import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPets, getAlerts } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [pets, setPets] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login')
    Promise.all([getPets(), getAlerts()])
      .then(([pRes, aRes]) => {
        setPets(pRes.data?.length ? pRes.data : [
          { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 3, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
          { id: 2, name: 'Milo', breed: 'Beagle', age: 2, status: 'lost', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
          { id: 3, name: 'Cleo', breed: 'Siamese Cat', age: 4, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400' }
        ]);
        setAlerts(aRes.data?.length ? aRes.data : [
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned in Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ]);
      })
      .catch(() => {
        setPets([
          { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 3, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
          { id: 2, name: 'Milo', breed: 'Beagle', age: 2, status: 'lost', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
          { id: 3, name: 'Cleo', breed: 'Siamese Cat', age: 4, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400' }
        ]);
        setAlerts([
          { id: 1, title: 'Pet Scanned!', message: 'Milo was scanned in Cebu City.', type: 'scan', created_at: new Date().toISOString(), is_read: false },
          { id: 2, title: 'Vaccine Reminder', message: 'Buddy is due for Rabies vaccination.', type: 'vaccine', created_at: new Date(Date.now() - 172800000).toISOString(), is_read: true }
        ]);
      })
      .finally(() => setLoading(false))
  }, [])

  const statusStyle = status => {
    if (status === 'healthy') return 'bg-tertiary-container text-on-tertiary-container'
    if (status === 'lost')    return 'bg-error text-on-error'
    return 'bg-secondary-container text-on-secondary-container'
  }

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center px-6 py-4">
        <div className="text-xl font-black text-primary flex items-center gap-2">
          <span className="material-symbols-outlined fill-1">pets</span>
          PetConnect
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/alerts" className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold text-sm">
            {user.name?.charAt(0) || 'U'}
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-extrabold text-primary mb-1">Hello, {user.name?.split(' ')[0] || 'Owner'}</h1>
          <p className="text-on-surface-variant font-medium">Your pets are looking great today.</p>
        </section>

        {/* My Pets Grid */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-primary">My Pets</h2>
            <Link to="/dashboard/pets" className="text-secondary font-bold hover:underline text-sm uppercase tracking-wider">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:shadow-xl transition-all duration-300">
                <div className="h-56 relative overflow-hidden">
                  <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <span className={`absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${statusStyle(pet.status)} shadow-sm`}>
                    {pet.status}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-primary leading-none mb-1">{pet.name}</h3>
                      <p className="text-on-surface-variant text-sm font-medium">{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                    </div>
                    <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined">nfc</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-container">
                    <Link to={`/pet/${pet.id}/edit`} className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">edit</span>
                      Edit
                    </Link>
                    <Link to={`/pet/${pet.id}`} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="bg-surface-container-low/50 rounded-2xl p-8 border border-surface-container">
          <h2 className="text-xl font-bold text-primary mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-white p-5 rounded-xl flex items-start gap-4 shadow-sm border border-surface-container">
                <div className={`mt-1 ${alert.type === 'scan' ? 'text-error' : 'text-primary'}`}>
                  <span className="material-symbols-outlined text-2xl">{alert.type === 'scan' ? 'location_on' : 'vaccines'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-primary">{alert.title}</h4>
                    <span className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-wider">{new Date(alert.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FAB */}
      <Link to="/pet/new" className="fixed bottom-32 right-6 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
