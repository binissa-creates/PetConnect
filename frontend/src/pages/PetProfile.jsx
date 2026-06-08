import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getPet, reportLost, resolvedLost } from '../services/api'
import BottomNav from '../components/BottomNav'

export default function PetProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showLostModal, setShowLostModal] = useState(false)
  const [lostForm, setLostForm] = useState({
    last_seen_location: '',
    reward_amount: '',
    lost_description: ''
  })

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
          vaccines: JSON.stringify([
            { name: 'Rabies', date: '2024-05-15', next_due: '2025-05-15' },
            { name: 'Parvovirus', date: '2024-02-10', next_due: '2025-02-10' }
          ]),
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
    if (pet.status === 'lost') {
      await resolvedLost(id)
      setPet(p => ({ ...p, status: 'healthy' }))
    } else {
      setShowLostModal(true)
    }
  }

  const handleReportLost = async (e) => {
    e.preventDefault()
    await reportLost(id, lostForm)
    setPet(p => ({ ...p, status: 'lost', ...lostForm }))
    setShowLostModal(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
    </div>
  )
  if (!pet) return null

  // Parse marking images safely
  let markingImages = []
  try {
    if (pet.marking_images && typeof pet.marking_images === 'string' && pet.marking_images.startsWith('[')) {
      markingImages = JSON.parse(pet.marking_images)
    }
  } catch (e) {
    console.error("Failed to parse marking images", e)
  }

  // Parse vaccines if they are stringified JSON
  let vaccineList = []
  try {
    if (pet.vaccines && typeof pet.vaccines === 'string' && pet.vaccines.startsWith('[')) {
      vaccineList = JSON.parse(pet.vaccines)
    } else {
      vaccineList = [{ name: 'Status', date: pet.vaccines || 'Up to date', next_due: '—' }]
    }
  } catch (e) {
    vaccineList = [{ name: 'Status', date: pet.vaccines || 'Up to date', next_due: '—' }]
  }

  const infoRows = [
    { icon: 'category',       label: 'Species',    value: pet.species },
    { icon: 'genetics',       label: 'Breed',      value: pet.breed },
    { icon: 'cake',           label: 'Age',         value: `${pet.age} year(s)` },
    { icon: 'scale',          label: 'Weight',      value: pet.weight ? `${pet.weight} kg` : '—' },
    { icon: 'palette',        label: 'Color',       value: pet.color || '—' },
    { icon: 'medical_services', label: 'Conditions', value: pet.medical_conditions || 'None' },
  ]

  return (
    <div className="bg-surface min-h-screen pb-40 selection:bg-primary-container selection:text-primary">
      {/* Lost Pet Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowLostModal(false)}></div>
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative animate-scale-in p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-error text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Report Lost Pet</h2>
                <p className="text-xs text-on-surface-variant font-medium">Help finders return {pet.name} safely.</p>
              </div>
            </div>

            <form onSubmit={handleReportLost} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Last Known Location</label>
                <input 
                  required
                  placeholder="e.g. Near IT Park parking lot"
                  className="w-full bg-surface-container-low border border-surface-container rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-error/5 outline-none"
                  value={lostForm.last_seen_location}
                  onChange={e => setLostForm({...lostForm, last_seen_location: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Reward (Optional)</label>
                <input 
                  placeholder="e.g. PHP 5,000 or Treats"
                  className="w-full bg-surface-container-low border border-surface-container rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-error/5 outline-none"
                  value={lostForm.reward_amount}
                  onChange={e => setLostForm({...lostForm, reward_amount: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">Additional Notes</label>
                <textarea 
                  rows={3}
                  placeholder="Mention unique behavior or urgent medical needs..."
                  className="w-full bg-surface-container-low border border-surface-container rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-error/5 outline-none resize-none"
                  value={lostForm.lost_description}
                  onChange={e => setLostForm({...lostForm, lost_description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowLostModal(false)} className="flex-1 py-4 bg-surface-container text-on-surface-variant font-bold rounded-2xl text-[10px] uppercase tracking-widest">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-error text-white font-bold rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-error/20 active:scale-95 transition-all">Report as Lost</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[400px] md:h-[500px] w-full bg-surface-container overflow-hidden relative">
          {pet.photo_url
            ? <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center bg-surface-container-low text-on-surface-variant/20"><span className="material-symbols-outlined text-[120px]">pets</span></div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
          
          {/* Header Controls */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
            <button 
              onClick={() => navigate(-1)} 
              className="w-11 h-11 bg-on-surface/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 hover:bg-on-surface/40 transition-all active:scale-90"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className={`px-4 py-2 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-2 ${pet.status === 'lost' ? 'bg-error/90 border-error/20 text-white animate-pulse' : 'bg-tertiary-container/90 border-tertiary/20 text-on-tertiary-container'}`}>
              <span className="material-symbols-outlined text-sm">{pet.status === 'lost' ? 'warning' : 'verified'}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{pet.status}</span>
            </div>
          </div>
        </div>

        {/* Floating Profile Card */}
        <div className="relative -mt-20 px-6 max-w-2xl mx-auto z-20">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary/10 border border-surface-container/50">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-serif-elegant font-black text-on-surface tracking-tight mb-2 leading-tight">
                  {pet.name}
                </h1>
                <div className="flex items-center gap-2 text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-primary text-lg">category</span>
                  <span>{pet.breed} • {pet.age} year(s)</span>
                </div>
              </div>
              <Link 
                to={`/pet/${id}/edit`} 
                className="w-12 h-12 bg-primary-container text-primary rounded-2xl flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all shadow-sm active:scale-90"
              >
                <span className="material-symbols-outlined">edit_square</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-surface-container rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{pet.species}</span>
              <span className="px-3 py-1.5 bg-surface-container rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{pet.color}</span>
              <span className="px-3 py-1.5 bg-surface-container rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{pet.weight}kg</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-6 max-w-2xl mx-auto mt-8 space-y-10">
        {/* Emergency Alert Button */}
        <button
          onClick={toggleLost}
          className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all active:scale-[0.98] border-2 shadow-sm ${pet.status === 'lost' ? 'bg-tertiary-container border-tertiary/20 text-tertiary hover:bg-tertiary-container/80' : 'bg-error/5 border-error/20 text-error hover:bg-error/10'}`}
        >
          <span className="material-symbols-outlined text-lg align-middle mr-3">{pet.status === 'lost' ? 'verified' : 'warning'}</span>
          {pet.status === 'lost' ? 'Mark as Found' : 'Report as Lost Pet'}
        </button>

        {/* Tag ID & Digital Tag Section */}
        <div className="space-y-4">
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

          <div className="bg-white rounded-3xl p-8 border border-surface-container/50 shadow-sm flex flex-col md:flex-row items-center gap-8 group">
             <div className="w-32 h-32 bg-surface-container-low rounded-2xl flex items-center justify-center border-2 border-dashed border-surface-container relative overflow-hidden group-hover:border-primary transition-colors">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${window.location.origin}/tag/${pet.tag_id}`)}`} 
                  alt="QR Code" 
                  className="w-full h-full p-2"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm">
                   <a 
                     href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`${window.location.origin}/tag/${pet.tag_id}`)}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="bg-primary text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center"
                   >
                     <span className="material-symbols-outlined">download</span>
                   </a>
                </div>
             </div>
             <div className="text-center md:text-left">
                <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs mb-2">Digital Safety Tag</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed max-w-xs">Scan or download this QR code to share {pet.name}'s profile instantly. You can print this as a temporary backup tag.</p>
             </div>
          </div>
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

        {/* Identifying Photos */}
        {markingImages && markingImages.length > 0 && (
          <div className="space-y-4">
             <h3 className="font-serif-elegant font-bold text-xl text-on-surface flex items-center gap-3 ml-2">
                <span className="material-symbols-outlined text-primary">photo_library</span>
                Identifying Features
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {markingImages.map((url, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-surface-container/50 shadow-sm">
                     <img src={url} alt={`Marking ${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Vaccine History Section */}
        <div className="space-y-4">
           <h3 className="font-serif-elegant font-bold text-xl text-on-surface flex items-center gap-3 ml-2">
              <span className="material-symbols-outlined text-tertiary">vaccines</span>
              Vaccine Records
           </h3>
           <div className="grid grid-cols-1 gap-3">
              {vaccineList.map((v, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-surface-container/30 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-tertiary-container text-tertiary flex items-center justify-center">
                         <span className="material-symbols-outlined text-xl">event_available</span>
                      </div>
                      <div>
                         <p className="font-bold text-on-surface text-sm">{v.name}</p>
                         <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">Given: {v.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] mb-1">Next Due</p>
                      <p className="font-bold text-primary text-[11px]">{v.next_due}</p>
                   </div>
                </div>
              ))}
              <Link to={`/pet/${id}/edit`} className="w-full py-4 bg-surface-container-low text-on-surface-variant rounded-2xl border border-dashed border-surface-container flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all">
                 <span className="material-symbols-outlined text-lg">add_circle</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest">Update Records</span>
              </Link>
           </div>
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
                  <p className="font-bold">{pet.owner_phone || 'Not provided'}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">location_on</span>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Home Address</p>
                <p className="font-bold">{pet.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
      <style>{`
        .animate-fade-in { animation: fadeIn 0.2s; }
        .animate-scale-in { animation: scaleIn 0.25s cubic-bezier(.4,2,.6,1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
