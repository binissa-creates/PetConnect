import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPet, createPet, updatePet } from '../services/api'

export default function EditPet() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const markingInputRef = useRef(null)
  
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', species: 'Dog', breed: '', age: '', weight: '',
    color: '', medical_conditions: '', vaccines: '', hide_phone: false, address: '',
  })
  
  const [petPhoto, setPetPhoto] = useState(null)
  const [petPhotoPreview, setPetPhotoPreview] = useState(null)
  const [markingImages, setMarkingImages] = useState([])
  const [markingImagePreviews, setMarkingImagePreviews] = useState([])

  useEffect(() => {
    if (!isNew) {
      getPet(id).then(r => {
        setForm(r.data)
        if (r.data.photo_url) setPetPhotoPreview(r.data.photo_url)
      }).catch(() => {
        const mockPets = [
          { id: '1', name: 'Buddy', breed: 'Golden Retriever', species: 'Dog', age: 3, weight: 28, color: 'Golden', photo_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400' },
          { id: '2', name: 'Milo', breed: 'Beagle', species: 'Dog', age: 2, weight: 12, color: 'Brown/White', photo_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400' }
        ]
        const found = mockPets.find(p => p.id === String(id))
        if (found) {
          setForm(found)
          setPetPhotoPreview(found.photo_url)
        }
      }).finally(() => setLoading(false))
    }
  }, [id, isNew])

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const handlePetPhotoChange = e => {
    const file = e.target.files?.[0]
    if (file) {
      setPetPhoto(file)
      const reader = new FileReader()
      reader.onload = () => setPetPhotoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleMarkingImagesChange = e => {
    const files = Array.from(e.target.files || [])
    setMarkingImages(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setMarkingImagePreviews(prev => [...prev, reader.result])
      reader.readAsDataURL(file)
    })
  }

  const removeMarkingImage = index => {
    setMarkingImages(prev => prev.filter((_, i) => i !== index))
    setMarkingImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => formData.append(key, form[key]))
      if (petPhoto) formData.append('photo', petPhoto)
      markingImages.forEach((img, idx) => formData.append(`marking_${idx}`, img))
      
      if (isNew) await createPet(formData)
      else await updatePet(id, formData)
      navigate('/dashboard')
    } catch (err) {
      setError('Failed to save pet. Redirecting to dashboard...')
      setTimeout(() => navigate('/dashboard'), 1500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#f7f9f4] flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[#386948] text-4xl">progress_activity</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f9f4] pb-20 font-sans antialiased">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-5 flex items-center gap-4 border-b border-[#e5e7eb]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-[#f3f6f1] flex items-center justify-center text-[#386948] hover:bg-[#386948] hover:text-white transition-all shadow-sm">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-black text-[#1a2e1f] tracking-tight">{isNew ? 'Add New Pet' : 'Edit Pet Profile'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-6 pt-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-black uppercase tracking-widest text-center shadow-sm">{error}</div>
        )}

        {/* Primary Pet Photo */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">PRIMARY PHOTO</label>
          <div className="relative group">
            {petPhotoPreview ? (
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl border-4 border-white">
                <img src={petPhotoPreview} alt="Pet" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={() => { setPetPhoto(null); setPetPhotoPreview(null) }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-red-500 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 bg-white border-2 border-dashed border-[#e5e7eb] rounded-[2.5rem] cursor-pointer hover:bg-[#f3f6f1] hover:border-[#386948]/30 transition-all shadow-sm group">
                <div className="w-16 h-16 bg-[#f0f4ec] rounded-full flex items-center justify-center text-[#386948] mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </div>
                <p className="text-sm font-black text-[#386948] uppercase tracking-widest">Upload Profile Photo</p>
                <input type="file" accept="image/*" onChange={handlePetPhotoChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Core Info Grid */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-[#e5e7eb] shadow-xl shadow-[#1a4d2e]/5 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">PET NAME</label>
            <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Buddy" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">AGE (YEARS)</label>
              <input name="age" type="number" value={form.age || ''} onChange={handleChange} placeholder="3" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">WEIGHT (KG)</label>
              <input name="weight" type="number" value={form.weight || ''} onChange={handleChange} placeholder="12.5" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">COLOR / MARKINGS</label>
            <input name="color" value={form.color || ''} onChange={handleChange} placeholder="Golden with white patches" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
          </div>

          {/* NEW: Markings Photo Section */}
          <div className="space-y-4 pt-4 border-t border-[#f3f6f1]">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-[#386948] uppercase tracking-[0.2em]">IDENTIFYING MARKINGS PHOTOS</label>
              <span className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-widest">{markingImagePreviews.length}/4 PHOTOS</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {markingImagePreviews.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
                  <img src={url} alt="Marking" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeMarkingImage(i)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <span className="material-symbols-outlined text-white">delete</span>
                  </button>
                </div>
              ))}
              
              {markingImagePreviews.length < 4 && (
                <button 
                  type="button"
                  onClick={() => markingInputRef.current?.click()}
                  className="aspect-square bg-[#f3f6f1] border-2 border-dashed border-[#ced7c8] rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#f0f4ec] hover:border-[#386948]/30 transition-all group"
                >
                  <span className="material-symbols-outlined text-[#386948] group-hover:scale-110 transition-transform">add_circle</span>
                  <span className="text-[8px] font-black text-[#386948] uppercase tracking-widest">ADD PHOTO</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={markingInputRef} 
              onChange={handleMarkingImagesChange} 
            />
            <p className="text-[10px] text-[#6b7280] font-medium leading-relaxed italic">Upload photos of specific birthmarks, scars, or unique fur patterns for faster identification if your pet is ever scanned by an LGU admin.</p>
          </div>
        </div>

        {/* Extended Details */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-[#e5e7eb] shadow-xl shadow-[#1a4d2e]/5 space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">HOME ADDRESS</label>
            <input name="address" value={form.address || ''} onChange={handleChange} placeholder="Cebu City, Cebu" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">MEDICAL CONDITIONS</label>
            <textarea name="medical_conditions" value={form.medical_conditions || ''} onChange={handleChange} rows={3} placeholder="Any allergies or chronic conditions?" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">VACCINATION HISTORY</label>
            <textarea name="vaccines" value={form.vaccines || ''} onChange={handleChange} rows={3} placeholder="e.g. Rabies (2023), Parvo (2024)" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] resize-none" />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-5 bg-[#386948] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#386948]/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : <span className="material-symbols-outlined text-xl">check_circle</span>}
            {saving ? 'Saving Profile...' : (isNew ? 'Create Pet Profile' : 'Update Profile')}
          </button>
        </div>
      </form>
    </div>
  )
}