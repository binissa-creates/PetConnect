import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/dashboard/pets', icon: 'pets', label: 'My Pets' },
  { to: '/dashboard/alerts', icon: 'notifications', label: 'Alerts' },
  { to: '/dashboard/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-md rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-surface-container-low z-50">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center px-5 py-2 rounded-lg transition-all active:scale-90 duration-200 ${
              isActive
                ? 'bg-primary-container text-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >

          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
