import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPet, reportLost, resolvedLost } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function PetProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPet(id)
      .then(r => setPet(r.data))
      .catch(() => {
        // Fallback mockup data for demo
        setPet({
          id,
          name: 'Buddy',
          breed: 'Golden Retriever',
          species: 'Dog',
          age: 3,
          weight: 28,
          color: 'Golden',
          medical_conditions: 'Allergic to chicken',
          vaccines: 'Up to date (Rabies 2024)',
          status: 'healthy',
          tag_id: 'PTC-8829-X',
          owner_name: 'John Doe',
          owner_phone: '+63 912 345 6789',
          address: 'Banilad, Cebu City',
          photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600'
        })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const toggleLost = async () => {
    if (pet.status === 'lost') await resolvedLost(id)
    else await reportLost(id)
    setPet(p => ({ ...p, status: p.status === 'lost' ? 'healthy' : 'lost' }))
  }

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
    </div>
  )
  if (!pet) return null

  const infoRows = [
    { icon: 'category',       label: 'Species',    value: pet.species },
    { icon: 'genetics',       label: 'Breed',      value: pet.breed },
    { icon: 'cake',           label: 'Age',         value: `${pet.age} year(s)` },
    { icon: 'scale',          label: 'Weight',      value: pet.weight ? `${pet.weight} kg` : '—' },
    { icon: 'palette',        label: 'Color',       value: pet.color || '—' },
    { icon: 'medical_services', label: 'Conditions', value: pet.medical_conditions || 'None' },
    { icon: 'vaccines',       label: 'Vaccines',   value: pet.vaccines || 'Up to date' },
  ]

  return (
    <div className="bg-surface min-h-screen pb-32">
      {/* Hero */}
      <div className="relative h-72 bg-surface-container flex items-center justify-center">
        {pet.photo_url
          ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          : <span className="material-symbols-outlined text-outline-variant text-[120px]">pets</span>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-extrabold">{pet.name}</h1>
          <p className="text-white/80">{pet.breed} • {pet.age} yr</p>
        </div>
        <span className={`absolute top-4 right-4 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${pet.status === 'lost' ? 'bg-error text-on-error' : 'bg-tertiary-container text-on-tertiary-container'}`}>
          {pet.status}
        </span>
      </div>

      <main className="px-6 max-w-2xl mx-auto mt-6 space-y-6">
        {/* Actions */}
        <div className="flex gap-3">
          <Link to={`/pet/${id}/edit`} className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-default text-center hover:bg-primary-dim transition active:scale-95">
            <span className="material-symbols-outlined text-sm mr-1">edit</span> Edit Profile
          </Link>
          <button
            onClick={toggleLost}
            className={`flex-1 py-3 font-bold rounded-default transition active:scale-95 border-2 ${pet.status === 'lost' ? 'border-primary text-primary bg-transparent hover:bg-primary-container/20' : 'border-error text-error bg-transparent hover:bg-error/5'}`}
          >
            <span className="material-symbols-outlined text-sm mr-1">{pet.status === 'lost' ? 'check_circle' : 'emergency'}</span>
            {pet.status === 'lost' ? 'Mark Found' : 'Report Lost'}
          </button>
        </div>

        {/* Tag ID */}
        <div className="bg-white rounded-lg border border-surface-container p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-container rounded-default flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-2xl">nfc</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">NFC Tag ID</p>
            <p className="font-mono text-primary font-bold text-lg">{pet.tag_id || 'Not assigned'}</p>
          </div>
          {pet.tag_id && (
            <Link to={`/tag/${pet.tag_id}`} className="text-xs text-secondary font-bold hover:underline">Preview</Link>
          )}
        </div>

        {/* Info Rows */}
        <div className="bg-white rounded-lg border border-surface-container divide-y divide-surface-container-low">
          {infoRows.map(r => (
            <div key={r.label} className="flex items-center gap-4 p-4">
              <span className="material-symbols-outlined text-secondary text-xl">{r.icon}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{r.label}</p>
                <p className="font-semibold text-on-surface">{r.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Owner Contact */}
        <div className="bg-tertiary-container rounded-lg p-5 text-on-tertiary-container">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined">contact_phone</span> Owner Contact
          </h3>
          <p className="opacity-90">{pet.owner_name}</p>
          {!pet.hide_phone && <p className="opacity-90">{pet.owner_phone}</p>}
          <p className="opacity-90">{pet.address}</p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
