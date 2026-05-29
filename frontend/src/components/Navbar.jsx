import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container/30 soft-shadow h-[72px] flex items-center">
      <div className="flex justify-between items-center px-6 w-full max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-serif-elegant font-bold text-on-surface flex items-center gap-2 group transition-colors">
          <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pets</span>
          <span className="tracking-tight text-gradient">PetConnect</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login?role=owner" className="hidden sm:block px-5 py-2 rounded-default border border-primary/40 text-primary font-medium hover:bg-primary/5 hover:border-primary transition-all duration-200 text-sm">
            Sign In
          </Link>
          <Link to="/role-select" className="px-6 py-2 rounded-default bg-primary text-on-primary font-medium hover:bg-primary-light shadow-sm hover:shadow active:scale-98 transition-all duration-200 text-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
