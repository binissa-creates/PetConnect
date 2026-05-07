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
    // Update user in localStorage
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
    <div className="bg-surface min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-black text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">pets</span>
            PetConnect
          </div>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold text-sm border-2 border-primary/20 hover:bg-primary-container-high transition-colors"
          >
            {user.name?.charAt(0) || 'U'}
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {/* Title */}
        <section className="mb-10">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
            Settings
          </h1>
          <p className="text-on-surface-variant font-medium">Manage your account preferences.</p>
        </section>

        {/* Settings Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-surface-container space-y-6">
          {/* Success Message */}
          {saved && (
            <div className="p-3 bg-primary-container/20 border border-primary-container rounded-default text-primary text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">check_circle</span>
              Changes saved successfully!
            </div>
          )}

          {/* Profile Section */}
          <div>
            <h2 className="text-lg font-bold text-primary mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">person</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-default text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-default text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+63 912 345 6789"
                    className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-default text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full py-3 bg-primary text-on-primary font-bold rounded-default hover:bg-primary-dim transition-colors active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-surface-container pt-6">
            <h2 className="text-lg font-bold text-error mb-4">Danger Zone</h2>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-error text-on-error font-bold rounded-default hover:bg-error/90 transition-colors active:scale-95"
            >
              Sign Out
            </button>
          </div>
        </div>
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
