import { Link } from 'react-router-dom'

export default function RoleSelect() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">pets</span>
            PetConnect
          </Link>
          <h1 className="text-4xl font-extrabold text-on-surface mb-3">How are you joining us?</h1>
          <p className="text-lg text-on-surface-variant">Choose your account type to get started</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pet Owner Card */}
          <Link
            to="/login?role=owner"
            className="bg-white rounded-lg shadow-xl p-8 border-2 border-surface-container hover:border-primary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-primary-container rounded-default flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
              <span className="material-symbols-outlined text-2xl text-primary group-hover:text-on-primary">favorite</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">Pet Owner</h2>
            <p className="text-on-surface-variant mb-6">Register and manage your beloved pets. Keep their information safe and findable if they go missing.</p>
            <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
              <span>Sign In / Register</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </Link>

          {/* LGU Admin Card */}
          <Link
            to="/login?role=lgu"
            className="bg-white rounded-lg shadow-xl p-8 border-2 border-surface-container hover:border-secondary hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="w-16 h-16 bg-secondary-container rounded-default flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
              <span className="material-symbols-outlined text-2xl text-secondary group-hover:text-on-secondary">admin_panel_settings</span>
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-3">LGU Admin</h2>
            <p className="text-on-surface-variant mb-6">Manage lost pets in your jurisdiction. Help reunite lost animals with their owners through our platform.</p>
            <div className="flex items-center gap-2 text-secondary font-bold group-hover:gap-3 transition-all">
              <span>Sign In / Register</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-surface-container-low rounded-lg p-6">
          <h3 className="font-bold text-primary mb-3">What's the difference?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Pet Owner Account
              </h4>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li>✓ Register multiple pets</li>
                <li>✓ Get instant notifications when scanned</li>
                <li>✓ Manage health records</li>
                <li>✓ Report lost/found pets</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-secondary mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                LGU Admin Account
              </h4>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li>✓ Manage lost pets in jurisdiction</li>
                <li>✓ Access comprehensive pet database</li>
                <li>✓ Coordinate rescue efforts</li>
                <li>✓ Generate reports & analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
