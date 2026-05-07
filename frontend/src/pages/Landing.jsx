import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import petHero from '../assets/pet-hero.png'
import { useEffect } from 'react'

const features = [
// ... existing features ...
  { icon: 'warning',          title: 'Outdated Information',  desc: 'Phone numbers change. Digital profiles update in seconds.' },
  { icon: 'distance',         title: 'Lost Without a Trace',  desc: '1 in 3 pets will go missing in their lifetime.' },
  { icon: 'medical_services', title: 'Hidden Medical Needs',  desc: 'Rescuers need to know about allergies immediately.' },
  { icon: 'search_off',       title: 'The Microchip Barrier', desc: 'PetConnect tags are an obvious signal your pet has a digital home.' },
]

const steps = [
  { icon: 'app_registration', title: 'Register', desc: 'Create a free profile with photos, health info & contacts.' },
  { icon: 'link',             title: 'Attach',   desc: 'Hook the PetConnect tag to any collar or harness.' },
  { icon: 'qr_code_scanner',  title: 'Scan',     desc: 'Anyone with a smartphone can scan — no app required.' },
  { icon: 'sync',             title: 'Update',   desc: 'Change your info or status instantly from your phone.' },
]

const engineered = [
  { icon: 'location_on',   title: 'GPS Coordinates',  desc: "Receive a precise GPS pin of where your pet's tag was scanned." },
  { icon: 'verified_user', title: 'Privacy Shield',   desc: 'Hide your personal number and use our relay messaging.' },
  { icon: 'cloud_done',    title: 'Unlimited Profiles', desc: 'Manage your entire pack from one dashboard.' },
  { icon: 'water_drop',    title: 'Adventure-Proof',  desc: '100% waterproof and scratch-resistant.' },
]

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (token && user.role) {
      if (user.role === 'lgu' || user.role === 'admin') {
        navigate('/lgu')
      } else {
        navigate('/dashboard')
      }
    }
  }, [navigate])

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Navbar />

      {/* Hero */}
      <main className="pt-20">
        <section className="relative overflow-hidden px-6 py-16 md:py-28 lg:py-36 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 order-2 lg:order-1">
              <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-tight tracking-tight mb-6">
                Smart ID for <br />Every Pet
              </h1>
              <p className="text-xl md:text-2xl text-on-surface-variant mb-10 font-medium">
                Tap. Scan. Reunite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/role-select" className="px-8 py-4 bg-secondary text-on-secondary rounded-default font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 text-center">
                  Register Your Pet
                </Link>
                <a href="#how" className="px-8 py-4 border-2 border-outline text-primary rounded-default font-bold text-lg hover:bg-surface-container-low transition-all active:scale-95 text-center">
                  Learn How It Works
                </a>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-secondary-container/20 rounded-full blur-3xl -z-10" />
              <div className="rounded-xl overflow-hidden shadow-2xl transform rotate-2 bg-surface-container">
                <img src={petHero} alt="Happy dog with PetConnect tag" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-default shadow-lg border-l-4 border-secondary max-w-[200px]">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Instant Notification</p>
                <p className="text-sm font-semibold text-primary">Get the exact location the moment your pet is scanned.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why PetConnect */}
        <section className="bg-surface-container-low py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">Why PetConnect?</h2>
              <p className="text-on-surface-variant max-w-2xl">Standard tags wear out. Microchips require scanners. We bridge the gap with instant, digital connectivity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map(f => (
                <div key={f.title} className="bg-white p-8 rounded-lg border-l-4 border-secondary shadow-sm">
                  <span className="material-symbols-outlined text-secondary mb-4 text-3xl block">{f.icon}</span>
                  <h3 className="text-xl font-bold text-primary mb-2">{f.title}</h3>
                  <p className="text-on-surface-variant">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-primary mb-4">How It Works</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg text-on-primary relative">
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-on-secondary text-xs font-bold rounded-full flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Engineered for Safety */}
        <section className="bg-surface-container-low py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-primary mb-4">Engineered for Safety</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {engineered.map(e => (
                <div key={e.title} className="bg-tertiary-container p-10 rounded-xl flex gap-6 items-start">
                  <div className="bg-white p-3 rounded-default shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-secondary text-3xl">{e.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-tertiary-container mb-2">{e.title}</h3>
                    <p className="text-on-tertiary-fixed-variant leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LGU Admin Section */}
        <section className="py-24 px-6 bg-secondary-container">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest text-on-secondary-container mb-3 block">For Local Government Units</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 leading-tight">
                  Reunite Lost Pets in Your Community
                </h2>
                <p className="text-lg text-on-surface-variant mb-8">
                  PetConnect empowers LGU staff to manage lost pets, coordinate rescue efforts, and connect with the pet community to bring animals home faster.
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-primary">Centralized Database</h4>
                      <p className="text-on-surface-variant text-sm">Access all lost pets in your jurisdiction in one place</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-primary">Real-Time Alerts</h4>
                      <p className="text-on-surface-variant text-sm">Get instant notifications when pets are scanned in your area</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-primary">Rescue Coordination</h4>
                      <p className="text-on-surface-variant text-sm">Organize and manage rescue operations efficiently</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                    <div>
                      <h4 className="font-bold text-primary">Community Reports</h4>
                      <p className="text-on-surface-variant text-sm">Analytics and reports on lost pets in your community</p>
                    </div>
                  </li>
                </ul>
                <Link to="/login?role=lgu" className="inline-block px-8 py-4 bg-primary text-on-primary rounded-default font-bold shadow-lg hover:bg-primary-dim transition-all active:scale-95">
                  LGU Admin Login
                </Link>
              </div>
              <div className="hidden lg:flex">
                <div className="w-full h-96 bg-surface-container-low rounded-lg flex items-center justify-center border-4 border-primary">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-8xl text-primary">admin_panel_settings</span>
                    <p className="text-on-surface-variant font-bold mt-4">LGU Admin Portal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative py-12 px-8">
              <span className="absolute top-0 left-1/2 -translate-x-1/2 text-secondary-container/40 text-9xl font-serif leading-none">"</span>
              <blockquote className="text-3xl md:text-5xl font-extrabold text-primary relative z-10 leading-tight">
                No pet should go unidentified.
              </blockquote>
              <div className="mt-8 flex justify-center">
                <div className="w-20 h-1 bg-secondary rounded-full" />
              </div>
              <p className="mt-10 text-on-surface-variant text-lg">Join 50,000+ pet parents who sleep better at night.</p>
              <Link to="/register" className="mt-12 inline-block px-10 py-5 bg-secondary text-on-secondary rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all">
                Secure Your Pet Today
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-on-primary pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-2xl font-black flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary-container">pets</span>
              <span>PetConnect</span>
            </div>
            <p className="text-primary-container text-sm leading-relaxed">The sanctuary for digital pet safety. We build tools to ensure every pet finds their way home.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-secondary-container">Product</h4>
            <ul className="space-y-4 text-primary-container text-sm">
              <li><a href="#" className="hover:text-on-primary transition-colors">Smart Tags</a></li>
              <li><a href="#" className="hover:text-on-primary transition-colors">Mobile App</a></li>
              <li><a href="#" className="hover:text-on-primary transition-colors">Subscription Plans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-secondary-container">Support</h4>
            <ul className="space-y-4 text-primary-container text-sm">
              <li><a href="#" className="hover:text-on-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-on-primary transition-colors">Contact Us</a></li>
              <li><Link to="/login" className="hover:text-on-primary transition-colors">LGU Staff Portal</Link></li>
              <li><a href="#" className="hover:text-on-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-6 text-secondary-container">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-sm">share</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <span className="material-symbols-outlined text-sm">group</span>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 text-center text-primary-container text-xs">
          <p>© 2024 PetConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
