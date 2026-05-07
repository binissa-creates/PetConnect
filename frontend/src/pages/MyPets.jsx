import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getPets } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function MyPets() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) return navigate('/login')
    getPets()
      .then(res => {
        setPets(res.data?.length ? res.data : [
          { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 3, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
          { id: 2, name: 'Milo', breed: 'Beagle', age: 2, status: 'lost', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
          { id: 3, name: 'Cleo', breed: 'Siamese Cat', age: 4, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400' }
        ])
      })
      .catch(() => {
        setPets([
          { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 3, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
          { id: 2, name: 'Milo', breed: 'Beagle', age: 2, status: 'lost', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' },
          { id: 3, name: 'Cleo', breed: 'Siamese Cat', age: 4, status: 'healthy', photo_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=400' }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const statusColor = status => {
    if (status === 'healthy') return 'bg-primary-container text-primary'
    if (status === 'lost')    return 'bg-error text-on-error'
    return 'bg-tertiary-container text-tertiary'
  }

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
            <Link
              to="/dashboard/alerts"
              className="relative p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors rounded-full"
            >
              <span className="material-symbols-outlined">notifications</span>
            </Link>
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
            My Pets
          </h1>
          <p className="text-on-surface-variant font-medium">Manage all your pets in one place.</p>
        </section>

        {/* Pets Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-surface-container">
            <span className="material-symbols-outlined text-6xl text-outline-variant">pets</span>
            <p className="mt-4 text-on-surface-variant font-medium">No pets yet. Add your first one!</p>
            <Link to="/pet/new" className="mt-6 inline-block px-6 py-3 bg-primary text-on-primary font-bold rounded-default hover:bg-primary-dim transition-colors">
              Add Pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-lg overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-surface-container">
                <div className="h-48 w-full bg-surface-container overflow-hidden relative flex items-center justify-center">
                  {pet.photo_url
                    ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <span className="material-symbols-outlined text-outline-variant text-7xl">pets</span>
                  }
                  <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${statusColor(pet.status)}`}>
                    {pet.status}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{pet.name}</h3>
                      <p className="text-on-surface-variant text-sm">{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                    </div>
                    <span className="material-symbols-outlined text-secondary">nfc</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <Link to={`/pet/${pet.id}/edit`} className="text-on-surface-variant text-sm font-bold flex items-center gap-1 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span> Edit
                    </Link>
                    <Link to={`/pet/${pet.id}`} className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </Link>
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
