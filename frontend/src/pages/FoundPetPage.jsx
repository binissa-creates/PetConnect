import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import API, { getPublicTag, submitSighting } from '../services/api'
import MapComponent from '../components/MapComponent'

export default function FoundPetPage() {
  const { tagId } = useParams()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [msg, setMsg] = useState('')
  const [msgSent, setMsgSent] = useState(false)
  const [msgError, setMsgError] = useState('')

  const [sightingForm, setSightingForm] = useState({
    reporter_name: '',
    reporter_phone: '',
    message: '',
    latitude: '',
    longitude: ''
  })
  const [locShared, setLocShared] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [sightingSuccess, setSightingSuccess] = useState('')
  const [sightingError, setSightingError] = useState('')

  useEffect(() => {
    getPublicTag(tagId)
      .then(r => {
        if (r.data.status !== 'lost') {
          window.location.replace(`/tag/${tagId}`)
          return
        }
        setPet(r.data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        API.post(`/public/scan/${tagId}`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          scanType: 'nfc'
        }).catch(() => {})
      })
    }
  }, [tagId])

  const shareLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => {
        setSightingForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }))
        setLocShared(true)
      },
      () => setSightingError('Could not access your location. Please describe where you are in the message.')
    )
  }

  const sendMessage = async e => {
    e.preventDefault()
    setMsgError('')
    try {
      await API.post(`/public/message/${tagId}`, { message: msg })
      setMsgSent(true)
    } catch {
      setMsgError('Failed to send message. Please try calling the owner instead.')
    }
  }

  const handleSightingSubmit = async e => {
    e.preventDefault()
    if (!pet?.lost_report_id) {
      setSightingError('Lost report not found. Please call the owner directly.')
      return
    }
    setSubmitting(true)
    setSightingError('')
    setSightingSuccess('')
    try {
      await submitSighting(pet.lost_report_id, sightingForm)
      setSightingSuccess(`Thank you! Your sighting was sent to ${pet.owner_name}.`)
      setSightingForm({ reporter_name: '', reporter_phone: '', message: '', latitude: '', longitude: '' })
      setLocShared(false)
    } catch {
      setSightingError('Failed to report sighting. Please try again or call the owner.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-error text-5xl">progress_activity</span>
      </div>
    )
  }

  if (notFound || !pet) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 text-center gap-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">qr_code_scanner</span>
        <h1 className="text-2xl font-serif-elegant font-bold text-on-surface">Tag Not Found</h1>
        <p className="text-sm text-on-surface-variant font-light">This PetConnect tag is not registered or has been deactivated.</p>
        <Link to="/" className="mt-4 py-3 px-8 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl">
          Go to Home
        </Link>
      </div>
    )
  }

  const showOwnerPhone = pet.owner_phone && !pet.hide_phone
  const showAddress = pet.address && !pet.hide_address
  const mapLat = pet.last_seen_lat || pet.latitude || 10.3364
  const mapLng = pet.last_seen_lng || pet.longitude || 123.8971

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans antialiased pb-10">
      <header className="fixed top-0 w-full z-50 bg-error/95 backdrop-blur-md flex justify-between items-center px-6 h-16 border-b border-white/10">
        <span className="material-symbols-outlined text-white">pets</span>
        <h1 className="text-xs font-black text-white tracking-[0.25em] uppercase">Lost Pet — Help Reunite</h1>
        <span className="material-symbols-outlined text-white animate-pulse">warning</span>
      </header>

      <main className="pt-20 px-5 max-w-lg mx-auto w-full space-y-6">
        {/* Emergency banner */}
        <div className="bg-error rounded-2xl p-5 text-center shadow-xl shadow-error/25 space-y-2">
          <p className="text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">emergency</span>
            This pet is reported lost
          </p>
          {pet.reward_amount && (
            <p className="inline-block bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/20">
              Reward: {pet.reward_amount}
            </p>
          )}
        </div>

        {/* Pet identity */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-surface-container text-center">
          <img
            src={pet.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'}
            alt={pet.name}
            className="w-36 h-36 rounded-full object-cover border-4 border-error/20 shadow-xl mx-auto mb-4"
          />
          <h2 className="text-3xl font-serif-elegant font-bold text-on-surface">{pet.name}</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {[pet.breed, pet.species, pet.sex, pet.color].filter(Boolean).join(' • ')}
          </p>
          {pet.barangay && (
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-3 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-sm">location_on</span>
              Barangay {pet.barangay}
            </p>
          )}
        </div>

        {/* Last seen & description */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-error/20 space-y-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-xl mt-0.5">my_location</span>
            <div>
              <p className="text-[10px] font-bold text-error uppercase tracking-wider">Last seen</p>
              <p className="text-sm font-bold text-on-surface">{pet.last_seen_location || 'Location not specified'}</p>
            </div>
          </div>
          {pet.lost_description && (
            <p className="text-xs text-on-surface-variant italic leading-relaxed border-l-2 border-error/30 pl-4">
              "{pet.lost_description}"
            </p>
          )}
          {pet.contact_instructions && (
            <div className="bg-surface-container-low rounded-xl p-4">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Owner instructions</p>
              <p className="text-xs text-on-surface leading-relaxed">{pet.contact_instructions}</p>
            </div>
          )}
        </div>

        {/* Map */}
        {(pet.last_seen_lat || pet.last_seen_lng) && (
          <div className="rounded-[2rem] overflow-hidden border border-surface-container shadow-lg h-52">
            <MapComponent lat={mapLat} lng={mapLng} zoom={15} />
          </div>
        )}

        {/* Owner contact — primary CTA for finders */}
        <div className="bg-brown-gradient rounded-[2rem] p-6 text-on-primary shadow-xl space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Pet owner</p>
            <h3 className="text-2xl font-serif-elegant font-bold">{pet.owner_name}</h3>
          </div>

          {showOwnerPhone ? (
            <a
              href={`tel:${pet.owner_phone}`}
              className="flex items-center justify-center gap-3 py-4 bg-white text-primary rounded-2xl font-bold text-sm shadow-lg hover:scale-[1.01] transition-all"
            >
              <span className="material-symbols-outlined">call</span>
              Call {pet.owner_name} — {pet.owner_phone}
            </a>
          ) : (
            <p className="text-xs text-white/80 bg-white/10 rounded-xl p-4 border border-white/20">
              Phone number is hidden. Use the message form below to reach the owner.
            </p>
          )}

          {showAddress && (
            <div className="flex items-start gap-2 text-xs text-white/90">
              <span className="material-symbols-outlined text-sm">home</span>
              <span>{pet.address}</span>
            </div>
          )}
        </div>

        {/* Emergency contacts */}
        {pet.emergencyContacts?.length > 0 && (
          <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-surface-container space-y-3">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-lg">contact_emergency</span>
              Emergency contacts
            </h3>
            {pet.emergencyContacts.map(c => (
              <div key={c.id} className="flex justify-between items-center py-3 border-b border-surface-container/50 last:border-0">
                <div>
                  <p className="text-sm font-bold text-on-surface">{c.contact_name}</p>
                  <p className="text-[10px] text-on-surface-variant">{c.relationship || 'Contact'}</p>
                </div>
                <a href={`tel:${c.contact_phone}`} className="text-primary font-bold text-sm hover:underline">
                  {c.contact_phone}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Medical info for finders */}
        {!pet.hide_medical && (pet.medical_conditions || pet.vaccinations?.length > 0) && (
          <div className="bg-primary-container/20 rounded-[2rem] p-6 border border-primary/10 space-y-2">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">medical_information</span>
              Medical notes
            </h3>
            {pet.medical_conditions && (
              <p className="text-xs text-on-surface-variant leading-relaxed">{pet.medical_conditions}</p>
            )}
            {pet.vaccinations?.length > 0 && (
              <p className="text-[10px] text-on-surface-variant">
                Vaccinations: {pet.vaccinations.map(v => v.vaccine_name).join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Quick message to owner */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-surface-container space-y-4">
          <h3 className="text-lg font-serif-elegant font-bold text-on-surface">Send a message to the owner</h3>
          {msgSent ? (
            <div className="text-center py-6 bg-tertiary-container/30 rounded-2xl border border-tertiary/20">
              <span className="material-symbols-outlined text-tertiary text-3xl mb-2">check_circle</span>
              <p className="text-xs font-bold text-tertiary uppercase tracking-wider">Message sent to owner</p>
            </div>
          ) : (
            <form onSubmit={sendMessage} className="space-y-3">
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                rows={3}
                required
                placeholder={`I found ${pet.name} near...`}
                className="w-full px-4 py-4 bg-surface-container-low border border-surface-container rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              {msgError && <p className="text-xs text-error">{msgError}</p>}
              <button type="submit" className="w-full py-4 bg-on-surface text-surface rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary transition-all">
                Notify Owner
              </button>
            </form>
          )}
        </div>

        {/* Sighting report */}
        <div className="bg-white rounded-[2rem] p-6 shadow-lg border border-surface-container space-y-4">
          <h3 className="text-lg font-serif-elegant font-bold text-on-surface">Report a sighting</h3>
          <p className="text-xs text-on-surface-variant">Share where and when you saw {pet.name} so the owner can search that area.</p>

          {sightingSuccess && (
            <div className="p-4 bg-tertiary-container/30 border border-tertiary/20 rounded-xl text-tertiary text-xs font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">verified</span>
              {sightingSuccess}
            </div>
          )}
          {sightingError && <p className="text-xs text-error">{sightingError}</p>}

          <form onSubmit={handleSightingSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your name"
                value={sightingForm.reporter_name}
                onChange={e => setSightingForm({ ...sightingForm, reporter_name: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="Your phone"
                value={sightingForm.reporter_phone}
                onChange={e => setSightingForm({ ...sightingForm, reporter_phone: e.target.value })}
                className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs focus:outline-none"
              />
            </div>
            <textarea
              required
              rows={3}
              placeholder="Describe where you saw the pet, its condition, direction of travel..."
              value={sightingForm.message}
              onChange={e => setSightingForm({ ...sightingForm, message: e.target.value })}
              className="w-full bg-surface-container-low border border-surface-container rounded-xl p-4 text-xs resize-none focus:outline-none"
            />
            <div className="flex items-center justify-between p-3 bg-surface-container-low/50 rounded-xl">
              <span className="text-xs text-on-surface-variant">Share GPS location</span>
              <button
                type="button"
                onClick={shareLocation}
                className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase ${locShared ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container text-primary'}`}
              >
                {locShared ? 'Shared ✓' : 'Share'}
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-error text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Submit Sighting Report'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-on-surface-variant/50 uppercase tracking-widest py-6">
          Powered by PetConnect Smart ID
        </p>
      </main>
    </div>
  )
}
