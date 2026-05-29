import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function Settings() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="bg-surface min-h-screen pb-40 selection:bg-primary-container selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container/30 soft-shadow">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-xl font-serif-elegant font-bold text-on-surface flex items-center gap-2 group transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pets</span>
            <span className="text-gradient">PetConnect</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-primary-container border border-primary/20 text-primary font-bold text-sm shadow-sm hover:shadow transition-all"
          >
            {user.name?.charAt(0) || 'U'}
          </button>
        </div>
      </header>

      <main className="pt-28 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <section className="mb-12 relative">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-5xl font-serif-elegant font-bold text-on-surface tracking-tight mb-2">
            Account <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-lg text-on-surface-variant font-light">Manage your personal information and preferences.</p>
        </section>

        {/* Settings Form */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-primary/5 p-10 border border-surface-container/50 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brown-gradient"></div>
          
          {saved && (
            <div className="p-4 bg-tertiary-container/30 border border-tertiary/20 rounded-2xl text-tertiary text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in zoom-in duration-300">
              <span className="material-symbols-outlined text-lg">verified</span>
              Profile updated successfully
            </div>
          )}

          {/* Profile Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-primary">person_edit</span>
               <h2 className="text-lg font-serif-elegant font-bold text-on-surface">Personal Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">person</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low/50 border border-surface-container rounded-2xl text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">mail</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low/50 border border-surface-container rounded-2xl text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl">call</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low/50 border border-surface-container rounded-2xl text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-4 bg-brown-gradient text-on-primary font-bold rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-10 border-t border-surface-container/50">
            <h2 className="text-lg font-serif-elegant font-bold text-error mb-6">Danger Zone</h2>
            <button
              onClick={handleLogout}
              className="w-full py-4 border-2 border-error/20 text-error font-bold rounded-2xl hover:bg-error hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined">logout</span>
              Sign Out from Account
            </button>
          </div>
        </div>
      </main>

      {/* FAB */}
      <Link
        to="/pet/new"
        className="fixed right-8 bottom-32 w-16 h-16 bg-brown-gradient text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNav />
    </div>
  )
}
