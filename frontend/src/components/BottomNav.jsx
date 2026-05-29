import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: 'home', label: 'Home' },
  { to: '/dashboard/pets', icon: 'pets', label: 'Pets' },
  { to: '/dashboard/alerts', icon: 'notifications', label: 'Alerts' },
  { to: '/dashboard/settings', icon: 'settings', label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full h-[68px] flex justify-around items-center px-4 bg-surface/90 backdrop-blur-lg rounded-t-2xl shadow-[0_-4px_24px_rgba(139,94,60,0.06)] border-t border-surface-container/50 z-50">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard'}
          className={({ isActive }) =>
            `flex items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-primary text-on-primary shadow-md px-5 h-11 rounded-full gap-2'
                : 'text-on-surface-variant hover:text-primary w-11 h-11 rounded-full'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {isActive && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
