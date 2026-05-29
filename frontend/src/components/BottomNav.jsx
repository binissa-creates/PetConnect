import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/dashboard/pets', icon: 'pets', label: 'My Pets' },
  { to: '/dashboard/alerts', icon: 'notifications', label: 'Alerts' },
  { to: '/dashboard/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/90 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_24px_rgba(139,94,60,0.06)] border-t border-surface-container/50 z-50">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all active:scale-90 duration-300 ${
              isActive
                ? 'bg-primary text-on-primary shadow-md'
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          <span className="material-symbols-outlined text-[22px] transition-transform duration-300">{item.icon}</span>
          {/* Label removed for a more minimal pill look on mobile, or kept if preferred. Plan says "active state uses warm brown pill" */}
        </NavLink>
      ))}
    </nav>
  )
}
