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
      <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
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
    <div className="bg-surface min-h-screen pb-40 selection:bg-primary-container selection:text-primary">
      {/* Hero */}
      <div className="relative h-[450px] bg-surface-container overflow-hidden">
        {pet.photo_url
          ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-on-surface-variant/20"><span className="material-symbols-outlined text-[120px]">pets</span></div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg backdrop-blur-md ${pet.status === 'lost' ? 'bg-error text-on-error' : 'bg-tertiary-container text-on-tertiary-container'}`}>
            {pet.status}
          </span>
        </div>

        {/* Floating Name Card */}
        <div className="absolute bottom-0 left-0 w-full px-6 translate-y-1/2 z-20">
          <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-primary/5 border border-surface-container/50 flex justify-between items-end">
             <div>
                <h1 className="text-4xl md:text-5xl font-serif-elegant font-bold text-on-surface tracking-tight mb-2">{pet.name}</h1>
                <p className="text-on-surface-variant text-lg font-light">{pet.breed} • {pet.age} yr</p>
             </div>
             <Link to={`/pet/${id}/edit`} className="w-14 h-14 bg-primary-container text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-2xl">edit_note</span>
             </Link>
          </div>
        </div>
      </div>

      <main className="px-6 max-w-2xl mx-auto mt-24 space-y-10">
        {/* Emergency Alert Button */}
        <button
          onClick={toggleLost}
          className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] border-2 shadow-sm ${pet.status === 'lost' ? 'bg-tertiary-container border-tertiary/20 text-tertiary hover:bg-tertiary-container/80' : 'bg-error/5 border-error/20 text-error hover:bg-error/10'}`}
        >
          <span className="material-symbols-outlined text-lg align-middle mr-3">{pet.status === 'lost' ? 'verified' : 'warning'}</span>
          {pet.status === 'lost' ? 'Mark as Found' : 'Report as Lost Pet'}
        </button>

        {/* Tag ID Section */}
        <div className="bg-surface-container-low/30 rounded-3xl p-6 border border-surface-container/50 flex items-center gap-6">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-3xl">nfc</span>
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 mb-1">Assigned Tag ID</p>
            <p className="font-mono text-xl font-bold text-primary tracking-wider">{pet.tag_id || 'PC-XXXX-XXXX'}</p>
          </div>
          <Link to={`/tag/${pet.tag_id}`} className="px-4 py-2 bg-white text-[10px] font-bold text-secondary border border-surface-container rounded-lg uppercase tracking-widest hover:border-secondary transition-all">
            View Link
          </Link>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoRows.map(r => (
            <div key={r.label} className="bg-white p-6 rounded-2xl border border-surface-container/30 flex items-center gap-5 hover:border-primary/20 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center text-secondary/60">
                <span className="material-symbols-outlined text-2xl">{r.icon}</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-1">{r.label}</p>
                <p className="font-bold text-on-surface text-sm">{r.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Owner Card */}
        <div className="bg-brown-gradient rounded-[2.5rem] p-10 text-on-primary relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
          <h3 className="font-serif-elegant font-bold text-xl mb-8 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">shield_person</span>
            Emergency Contact
          </h3>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Primary Owner</p>
                <p className="font-bold">{pet.owner_name}</p>
              </div>
            </div>
            {!pet.hide_phone && (
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">call</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Phone Number</p>
                  <p className="font-bold">{pet.owner_phone}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Home Address</p>
                <p className="font-bold">{pet.address}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
