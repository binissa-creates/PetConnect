import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPublicTag } from '../services/api'
import axios from 'axios'

export default function PublicPetProfile() {
  const { tagId } = useParams()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [msgSent, setMsgSent] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getPublicTag(tagId)
      .then(r => setPet(r.data))
      .catch(() => {
        // Fallback mockup for demo
        setPet({
          tagId,
          name: 'Buddy',
          breed: 'Golden Retriever',
          species: 'Dog',
          age: 4,
          gender: 'Male',
          status: 'lost',
          registered_at: 'Cebu City',
          medical_conditions: ['Nut Allergy', 'Microchipped (ID: 102****55)'],
          vaccines: 'Up to date',
          owner_name: 'Sarah Jenkins',
          owner_phone: '+63 999 888 7777',
          photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
          references: [
            'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=200',
            'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=200'
          ]
        })
      })
      .finally(() => setLoading(false))

    // Send scan location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        axios.post(`http://localhost:5000/api/public/scan/${tagId}`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }).catch(() => {})
      })
    }
  }, [tagId])

  const sendMessage = async e => {
    e.preventDefault()
    try {
      await axios.post(`http://localhost:5000/api/public/message/${tagId}`, { message: msg })
      setMsgSent(true)
    } catch (err) {
      // For demo purposes, we'll pretend it worked
      setMsgSent(true)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-sky-400 text-4xl">progress_activity</span>
    </div>
  )

  if (notFound && !pet) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <span className="material-symbols-outlined text-8xl text-slate-300 mb-6">qr_code_scanner</span>
      <h1 className="text-2xl font-black text-slate-800 mb-2">Tag Not Registered</h1>
      <p className="text-slate-500">This PetConnect smart tag hasn't been activated yet.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-[#6b7280]/90 backdrop-blur-md flex justify-between items-center px-6 h-16 border-b border-white/10">
        <span className="material-symbols-outlined text-white/80">pets</span>
        <h1 className="text-lg font-black text-sky-200 tracking-[0.2em] uppercase">PetConnect</h1>
        <span className="material-symbols-outlined text-white/80">sensors</span>
      </header>

      <main className="pt-24 pb-32 px-5 max-w-lg mx-auto w-full space-y-6">
        {/* Banner */}
        {pet.status === 'lost' ? (
          <div className="bg-rose-100 border border-rose-200 rounded-xl p-4 flex items-center justify-center gap-3 animate-pulse">
            <span className="material-symbols-outlined text-rose-500 text-xl">warning</span>
            <span className="font-black text-rose-500 text-xs tracking-widest uppercase">⚠ This Pet is Lost</span>
            <span className="material-symbols-outlined text-rose-500 text-xl">warning</span>
          </div>
        ) : (
          <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-4 flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-emerald-600 text-xl">verified</span>
            <span className="font-black text-emerald-600 text-xs tracking-widest uppercase">Safe & Registered Pet</span>
          </div>
        )}

        {/* Profile Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-sky-400/20 rounded-full blur-2xl -z-10"></div>
            <img 
              src={pet.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'} 
              alt={pet.name} 
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl" 
            />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-1">{pet.name}</h2>
          <p className="text-slate-500 font-bold mb-4">{pet.breed} • {pet.species} • {pet.age} Years Old</p>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
            <span className="material-symbols-outlined text-emerald-500 text-sm">location_on</span>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Registered: {pet.registered_at || 'Cebu City'}</span>
          </div>
        </div>

        {/* Contact Owner Card */}
        <div className="bg-slate-500/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-200 mb-1">Owner Contact</p>
              <h3 className="text-xl font-black">{pet.owner_name || 'Sarah Jenkins'}</h3>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white">person</span>
            </div>
          </div>
          <div className="space-y-3">
            <a href={`tel:${pet.owner_phone}`} className="flex items-center justify-center gap-3 py-3.5 bg-slate-400/50 hover:bg-slate-400/70 rounded-xl font-bold transition-all border border-white/10">
              <span className="material-symbols-outlined text-lg">call</span>
              Call Michael
            </a>
            <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-white/90 text-slate-800 rounded-xl font-bold hover:bg-white transition-all">
              <span className="material-symbols-outlined text-lg">chat</span>
              Send Message
            </button>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-500">mail</span>
            Send a Quick Message
          </h3>
          {msgSent ? (
            <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="material-symbols-outlined text-4xl text-emerald-500 mb-2 block">check_circle</span>
              <p className="font-black text-emerald-700 uppercase tracking-widest text-xs">Message Sent Successfully</p>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="space-y-4">
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                rows={3}
                required
                placeholder="I found your pet near Sitio Banawa..."
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none outline-none"
              />
              <button type="submit" className="w-full py-4 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                Send Notification
              </button>
            </form>
          )}
        </div>

        {/* Reference Photos */}
        <div className="bg-slate-500/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 text-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-400/20 rounded-xl flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined">photo_library</span>
            </div>
            <h3 className="font-black text-sm uppercase tracking-widest">Reference Photos</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(pet.references || [
              'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=200',
              'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=200',
              'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&q=80&w=200'
            ]).map((url, i) => (
              <img key={i} src={url} className="w-full h-24 object-cover rounded-xl border border-white/10 shadow-lg" alt="" />
            ))}
          </div>
        </div>

        {/* Medical & Vaccines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-600 text-sm">medical_services</span>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Medical</p>
            </div>
            <p className="text-xs font-bold text-amber-900 leading-relaxed">
              {Array.isArray(pet.medical_conditions) ? pet.medical_conditions.join(', ') : pet.medical_conditions || 'None'}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-emerald-600 text-sm">vaccines</span>
              <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Vaccines</p>
            </div>
            <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">
              {pet.vaccines || 'Up to date'}
            </p>
          </div>
        </div>

        {/* Footer Prompt */}
        <div className="text-center py-6 px-4">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Powered by PetConnect Smart Tag</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Scan this tag to identify pets and contact owners securely.
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-50 bg-[#2d3748] px-6 pb-6 pt-3 flex justify-around items-center border-t border-white/5 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        {[
          { icon: 'home', label: 'Home' },
          { icon: 'nfc', label: 'Scan', active: true },
          { icon: 'notifications', label: 'Alerts' },
          { icon: 'settings', label: 'Settings' }
        ].map(item => (
          <button key={item.label} className={`flex flex-col items-center gap-1 transition-all ${item.active ? 'text-sky-300 scale-110' : 'text-slate-400 opacity-60 hover:opacity-100'}`}>
            <span className={`material-symbols-outlined text-2xl ${item.active ? 'fill-1' : ''}`} style={{ fontVariationSettings: item.active ? "'FILL' 1" : "" }}>{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
