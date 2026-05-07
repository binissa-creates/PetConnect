import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, createPet } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    petName: '',
    species: 'Dog',
    breed: '',
    tagId: '',
    image: null,
    previewUrl: null
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: file, previewUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const simulateScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setFormData(prev => ({ ...prev, tagId: 'PC-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() }))
      setIsScanning(false)
    }, 2000)
  }

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        return setError('Please fill in all account details.')
      }
    }
    if (step === 2) {
      if (!formData.petName) return setError('Please provide your pet\'s name.')
    }
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinalSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      const authRes = await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.mobile,
        password: formData.password,
        role: 'owner'
      })

      localStorage.setItem('token', authRes.data.token)
      localStorage.setItem('user', JSON.stringify(authRes.data.user))

      await createPet({
        name: formData.petName,
        species: formData.species,
        breed: formData.breed,
        tag_id: formData.tagId,
        image_url: formData.previewUrl || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400'
      })

      navigate('/dashboard')
    } catch (err) {
      console.warn('API Error (Demo Mode Fallback):', err)
      setTimeout(() => {
        localStorage.setItem('token', 'demo-token')
        localStorage.setItem('user', JSON.stringify({ name: formData.fullName, email: formData.email, role: 'owner' }))
        navigate('/dashboard')
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, label: 'ACCOUNT', icon: 'account_circle' },
    { id: 2, label: 'PET INFO', icon: 'pets' },
    { id: 3, label: 'LINK TAG', icon: 'sensors' },
    { id: 4, label: 'CONFIRM', icon: 'check_circle' }
  ]

  return (
    <div className="min-h-screen bg-[#f7f9f4] font-sans antialiased flex flex-col">
      <header className="flex justify-between items-center px-10 py-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#1a4d2e] text-2xl font-black">pets</span>
          <span className="text-[#1a4d2e] text-xl font-black tracking-tight text-gradient">PetConnect</span>
        </div>
        <button onClick={() => navigate('/')} className="text-[#5e584f] text-[11px] font-black uppercase tracking-[0.2em] hover:underline transition-all">
          Save & Exit
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-40">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-between items-center mb-16 relative px-2">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#e5e7eb] -translate-y-1/2 z-0"></div>
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${step >= s.id ? 'bg-[#5e584f] text-white' : 'bg-white border border-[#e5e7eb] text-[#9ca3af]'}`}>
                  <span className={`material-symbols-outlined text-xl ${step >= s.id ? 'fill-1' : ''}`} style={{ fontVariationSettings: step >= s.id ? "'FILL' 1" : "" }}>{s.icon}</span>
                </div>
                <span className={`text-[9px] font-black tracking-[0.15em] ${step >= s.id ? 'text-[#5e584f]' : 'text-[#9ca3af]'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-black uppercase tracking-widest text-center animate-in zoom-in duration-300">
              {error}
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
            {step === 1 && (
              <div className="space-y-10">
                <div className="text-center space-y-3">
                  <h1 className="text-4xl font-black text-[#1a4d2e] tracking-tight">Create your account.</h1>
                  <p className="text-sm text-[#6b7280] font-medium tracking-wide">Start your journey to ultimate pet safety.</p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-[#e5e7eb] shadow-xl shadow-[#1a4d2e]/5 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#5e584f]"></div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">FULL NAME</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="John Doe" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] placeholder-[#9ca3af]/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">EMAIL ADDRESS</label>
                    <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] placeholder-[#9ca3af]/30" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">PASSWORD</label>
                    <div className="relative">
                      <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] placeholder-[#9ca3af]/30" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#5e584f] transition-colors">
                        <span className="material-symbols-outlined text-2xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-10">
                <div className="flex items-center gap-6 text-[#9ca3af]">
                   <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center font-black text-sm text-[#5e584f]">2</div>
                   <h2 className="text-2xl font-black tracking-tight text-[#1a2e1f]">Tell us about your pet</h2>
                   <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-[#e5e7eb] shadow-xl shadow-[#1a4d2e]/5 space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">PET'S NAME</label>
                    <input name="petName" value={formData.petName} onChange={handleChange} type="text" placeholder="e.g. Buddy" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">SPECIES</label>
                      <select name="species" value={formData.species} onChange={handleChange} className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f] appearance-none">
                        <option>Dog</option><option>Cat</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em] ml-1">BREED</label>
                      <input name="breed" value={formData.breed} onChange={handleChange} type="text" placeholder="e.g. Beagle" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-5 text-base font-bold text-[#1a2e1f]" />
                    </div>
                  </div>
                  
                  {/* REAL PHOTO UPLOAD */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group ${formData.previewUrl ? 'border-[#386948] bg-[#f0f4ec]' : 'border-[#e5e7eb] bg-[#fcfdfc] hover:border-[#386948]/30'}`}
                  >
                    {formData.previewUrl ? (
                      <img src={formData.previewUrl} className="w-24 h-24 rounded-2xl object-cover animate-in zoom-in duration-500 shadow-md" alt="Preview" />
                    ) : (
                      <div className="w-16 h-16 bg-[#f0f4ec] rounded-full flex items-center justify-center text-[#386948]">
                        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-[11px] font-black text-[#6b7280] uppercase tracking-[0.15em] mb-1">
                        {formData.previewUrl ? 'PHOTO LOADED SUCCESSFULLY' : 'Drag and drop pet photo here'}
                      </p>
                      <p className="text-[11px] font-black text-[#386948] uppercase tracking-[0.15em]">
                        {formData.previewUrl ? 'Click to change photo' : 'or click to upload'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10">
                <div className="flex items-center gap-6 text-[#9ca3af]">
                   <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center font-black text-sm text-[#5e584f]">3</div>
                   <h2 className="text-2xl font-black tracking-tight text-[#1a2e1f]">Link NFC Tag</h2>
                   <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-12 border border-[#e5e7eb] shadow-xl shadow-[#1a4d2e]/5 flex flex-col items-center gap-10">
                  <div className={`w-40 h-40 rounded-[2.5rem] flex items-center justify-center shadow-inner relative overflow-hidden transition-all duration-700 ${formData.tagId ? 'bg-[#386948]' : 'bg-[#ced7c8]'}`}>
                    {isScanning && <div className="absolute inset-0 bg-white/20 animate-ping scale-150 rounded-full"></div>}
                    <span className={`material-symbols-outlined text-6xl text-white ${isScanning ? 'animate-pulse' : ''}`}>{formData.tagId ? 'check_circle' : 'sensors'}</span>
                  </div>
                  
                  <div className="w-full space-y-6">
                    <div className="space-y-3 text-center">
                      <label className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em]">TAG ID NUMBER</label>
                      <input name="tagId" value={formData.tagId} onChange={handleChange} type="text" placeholder="PC - XXXX - XXXX" className="w-full bg-[#f3f6f1] border-none rounded-2xl p-6 text-center text-lg font-black text-[#1a2e1f] tracking-[0.2em]" />
                    </div>
                    <button 
                      onClick={simulateScan}
                      disabled={isScanning}
                      className="w-full py-5 bg-[#ced7c8] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#b8c5b3] transition-all shadow-md"
                    >
                      {isScanning ? 'Searching for tag...' : formData.tagId ? 'Tag Linked Successfully' : 'Scan NFC Link'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-10">
                <div className="flex items-center gap-6 text-[#9ca3af]">
                   <div className="w-10 h-10 rounded-full bg-[#e5e7eb] flex items-center justify-center font-black text-sm text-[#386948]">4</div>
                   <h2 className="text-2xl font-black tracking-tight text-[#1a2e1f]">Final Step</h2>
                   <div className="flex-1 h-[1px] bg-[#e5e7eb]"></div>
                </div>

                <div className="bg-[#f0f4ec] rounded-[3rem] p-12 border border-[#386948]/10 flex flex-col items-center text-center gap-10 shadow-xl shadow-[#386948]/5">
                  <div className="w-24 h-24 bg-[#386948] rounded-full flex items-center justify-center text-white shadow-2xl animate-bounce-slow">
                    <span className="material-symbols-outlined text-5xl">check</span>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-[#1a2e1f] tracking-tight">Your pet is now protected!</h2>
                    <p className="text-base text-[#6b7280] font-medium leading-relaxed">Everything is set up. You can now manage your pet's profile.</p>
                  </div>

                  <div className="w-full bg-white rounded-3xl p-6 flex items-center justify-between border border-[#e5e7eb] shadow-sm">
                    <div className="flex items-center gap-5">
                      <img src={formData.previewUrl || 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=120'} className="w-16 h-16 rounded-2xl object-cover shadow-sm" alt="" />
                      <div className="text-left">
                        <p className="text-lg font-black text-[#1a2e1f] leading-tight">{formData.petName || 'Buddy'}</p>
                        <p className="text-[10px] font-black text-[#9ca3af] uppercase tracking-[0.2em]">{formData.breed || 'Golden Retriever'}</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-[#f0f4ec] rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#386948] text-2xl">verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-[#e5e7eb] p-8 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center px-4">
          <button onClick={prevStep} className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-[#5e584f] hover:-translate-x-2'}`}>
            <span className="material-symbols-outlined text-lg">arrow_back</span> Back
          </button>
          <button 
            onClick={step === 4 ? handleFinalSubmit : nextStep}
            disabled={loading}
            className="px-14 py-5 bg-[#5e584f] text-white rounded-[1.25rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-4 shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 group"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : step === 4 ? 'Finish Setup' : 'Continue'}
            {!loading && <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 3s infinite ease-in-out; }
        .text-gradient { background: linear-gradient(to right, #1a4d2e, #386948); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}} />
    </div>
  )
}
