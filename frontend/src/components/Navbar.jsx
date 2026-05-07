import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-black text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">pets</span>
          <span>PetConnect</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login?role=owner" className="hidden md:block px-5 py-2 rounded-default border-2 border-primary text-primary font-semibold hover:bg-surface-container-low transition-all">
            Sign In
          </Link>
          <Link to="/role-select" className="hidden md:block px-6 py-2.5 rounded-default bg-secondary text-on-secondary font-semibold hover:opacity-90 transition-all active:scale-95 duration-200">
            Get Started
          </Link>
          <button className="md:hidden text-on-surface">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>

  )
}
