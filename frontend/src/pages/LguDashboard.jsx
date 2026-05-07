import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LguDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('OVERVIEW')
  const [loading, setLoading] = useState(true)
  const [hoveredBar, setHoveredBar] = useState(null)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const navItems = [
    { icon: 'home', label: 'Overview' },
    { icon: 'emergency', label: 'Alerts' },
    { icon: 'volunteer_activism', label: 'Adoption' },
    { icon: 'assessment', label: 'Reports' }
  ]

  const mainStats = [
    { icon: 'pets', label: 'REGISTERED PETS', value: '3,450', trend: '+12%', trendColor: 'bg-[#f0f4ec] text-[#386948]' },
    { icon: 'warning', label: 'STRAYS REPORTED', value: '112', trend: '-5%', trendColor: 'bg-[#fee2e2] text-[#ef4444]' },
    { icon: 'favorite', label: 'ADOPTIONS PENDING', value: '45', trend: '+15', trendColor: 'bg-[#fff7ed] text-[#f97316]' },
    { icon: 'vaccines', label: 'VAX COMPLIANCE', value: '3,174', trend: '92%', trendColor: 'bg-[#fef9c3] text-[#a16207]' },
  ]

  if (loading) return (
    <div className="min-h-screen bg-[#f7f9f4] flex items-center justify-center">
      <span className="material-symbols-outlined animate-spin text-[#386948] text-4xl">progress_activity</span>
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-4 pb-20 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        {mainStats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm flex justify-between items-start group hover:border-[#386948]/30 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 bg-[#f0f4ec] rounded-lg flex items-center justify-center text-[#386948] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{s.icon}</span>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#6b7280] tracking-widest uppercase mb-1">{s.label}</p>
                <p className="text-3xl font-black text-[#1a2e1f]">{s.value}</p>
              </div>
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${s.trendColor}`}>{s.trend}</span>
          </div>
        ))}
      </div>

      {/* Registration Growth Chart - ENHANCED */}
      <div className="bg-[#eff4eb] rounded-3xl p-8 border border-[#e5e7eb] relative overflow-hidden group/chart">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#386948]/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div>
            <h2 className="text-xl font-black text-[#386948] flex items-center gap-2">
              Registration Growth
              <span className="material-symbols-outlined text-sm animate-pulse text-[#386948]/40">monitoring</span>
            </h2>
            <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest">(Guadalupe)</p>
          </div>
          <div className="flex bg-white/50 backdrop-blur-sm rounded-full p-1 text-[9px] font-black border border-[#e5e7eb]">
            <button className="px-4 py-1.5 bg-[#386948] text-white rounded-full shadow-sm transition-all">Weekly</button>
            <button className="px-4 py-1.5 text-[#6b7280] hover:text-[#386948]">Monthly</button>
          </div>
        </div>
        
        <div className="flex items-end justify-between h-48 gap-4 px-2 relative z-10">
          {[35, 55, 95, 45, 70, 60, 85].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 flex flex-col items-center h-full group"
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="relative w-full h-full flex flex-col justify-end">
                {/* Tooltip */}
                <div className={`absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a2e1f] text-white text-[8px] font-black px-2 py-1 rounded transition-all duration-300 ${hoveredBar === i ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'}`}>
                  {Math.round(h * 1.5)} Pets
                </div>
                {/* Bar */}
                <div 
                  className={`w-full rounded-t-xl transition-all duration-700 ease-out cursor-pointer ${i === 2 ? 'bg-[#5e584f]' : 'bg-[#ced7c8] hover:bg-[#386948]/40'}`} 
                  style={{ height: `${h}%` }}
                ></div>
              </div>
              <span className="text-[9px] font-black text-[#9ca3af] uppercase mt-4 tracking-tighter shrink-0">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-sm">
        <h2 className="text-lg font-black text-[#386948] mb-6 flex items-center justify-between">
          Recent Activity
          <span className="text-[9px] font-black text-[#386948] bg-[#f0f4ec] px-3 py-1 rounded-full">LIVE</span>
        </h2>
        <div className="space-y-6 relative before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-[#e5e7eb]">
          {[
            { title: 'New Pet Registered', desc: '"Oreo" (Aspin) to Ricardo Abellana', time: '2 mins ago', color: 'bg-[#f97316]' },
            { title: 'Stray Report Received', desc: 'Paseo Arcenas, reported by local tanod', time: '10 mins ago', color: 'bg-[#ef4444]' },
            { title: 'Vaccination Updated', desc: '"Choco" (Shih Tzu) by Maria Garcia', time: '1 hour ago', color: 'bg-[#386948]' }
          ].map((a, i) => (
            <div key={i} className="flex gap-6 relative z-10">
              <div className={`w-2 h-2 rounded-full ${a.color} mt-1.5 shrink-0 shadow-sm ring-4 ring-white`}></div>
              <div className="flex-1">
                <h4 className="text-[13px] font-black text-[#1a2e1f] leading-none mb-1.5">{a.title}</h4>
                <p className="text-[11px] text-[#6b7280] font-medium leading-relaxed mb-1.5">{a.desc}</p>
                <p className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-tight">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl p-8 border border-[#e5e7eb] shadow-sm overflow-hidden">
        <div className="flex flex-col items-center mb-8 gap-4">
          <h2 className="text-lg font-black text-[#386948]">Registered Pets in Guadalupe</h2>
          <div className="flex gap-2 w-full">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9ca3af]">search</span>
              <input type="text" placeholder="Search records..." className="w-full bg-[#f7f9f4] border-none rounded-xl pl-9 pr-4 py-3 text-xs font-bold focus:ring-1 focus:ring-[#386948]/20 transition-all" />
            </div>
            <button className="bg-[#bbf7d0] text-[#166534] px-5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#166534] hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </button>
          </div>
          <button className="w-full bg-[#eee7de] text-[#5e584f] py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#5e584f] hover:text-white transition-all">
            <span className="material-symbols-outlined text-sm">download</span> Export CSV Report
          </button>
        </div>

        <div className="space-y-4">
          {[{ name: 'Bruno', owner: 'Antonio Mendoza', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=100' },
            { name: 'Mimi', owner: 'Isabella Abellana', img: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=100' },
            { name: 'Kalel', owner: 'Roberto Garcia', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100' }].map((pet, i) => (
            <div key={i} className="flex items-center justify-between p-3 hover:bg-[#f7f9f4] rounded-2xl transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <img src={pet.img} className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                <div>
                  <p className="text-sm font-black text-[#386948]">{pet.name}</p>
                  <p className="text-[10px] font-bold text-[#6b7280]">{pet.owner}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="bg-[#fef3c7] text-[#92400e] px-3 py-1 rounded-full text-[8px] font-black uppercase">ACTIVE</span>
                <span className="material-symbols-outlined text-xs text-[#386948]/40">verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'ALERTS':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-black text-[#1a2e1f] flex items-center gap-3">
               Security Alerts
               <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
             </h2>
             <div className="space-y-4">
               {[
                 { id: 1, title: 'Unregistered Tag Scan', location: 'Sitio Kawayan', time: '12m ago', type: 'error', icon: 'report_problem' },
                 { id: 2, title: 'Lost Pet Reported', location: 'Banawa Heights', time: '45m ago', type: 'warning', icon: 'location_searching' },
                 { id: 3, title: 'Stray Sighting Confirmed', location: 'Guadalupe Church', time: '2h ago', type: 'info', icon: 'info' }
               ].map(alert => (
                 <div key={alert.id} className="bg-white p-6 rounded-3xl border border-[#e5e7eb] flex justify-between items-center shadow-sm hover:border-[#386948]/20 transition-all">
                   <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${alert.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                       <span className="material-symbols-outlined text-3xl">{alert.icon}</span>
                     </div>
                     <div>
                       <p className="font-black text-[#1a2e1f] text-base">{alert.title}</p>
                       <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">{alert.location}</p>
                     </div>
                   </div>
                   <span className="text-[10px] font-black text-[#9ca3af] uppercase bg-[#f3f4f6] px-3 py-1 rounded-full">{alert.time}</span>
                 </div>
               ))}
             </div>
          </div>
        )
      case 'ADOPTION':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center bg-[#386948] p-8 rounded-[2.5rem] text-white shadow-xl shadow-[#386948]/20 mb-8">
               <div>
                <h2 className="text-2xl font-black mb-1">Adoption Pipeline</h2>
                <p className="text-xs font-medium opacity-70 uppercase tracking-widest">Guadalupe Rescue Center</p>
               </div>
               <div className="text-right">
                 <p className="text-4xl font-black">45</p>
                 <p className="text-[9px] font-black uppercase opacity-60">Animals Waiting</p>
               </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { name: 'Luna', breed: 'Aspin', age: '2y', status: 'In Interview', img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300' },
                 { name: 'Cooper', breed: 'Beagle', age: '1y', status: 'Home Visit', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=300' }
               ].map(pet => (
                 <div key={pet.name} className="bg-white p-5 rounded-[2rem] border border-[#e5e7eb] flex flex-col gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                   <div className="relative overflow-hidden rounded-2xl">
                    <img src={pet.img} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-[#386948] uppercase">
                      {pet.status}
                    </div>
                   </div>
                   <div className="px-1">
                     <p className="font-black text-[#1a2e1f] text-xl leading-none mb-1">{pet.name}</p>
                     <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-widest">{pet.breed} • {pet.age}</p>
                   </div>
                   <button className="w-full py-3 bg-[#f7f9f4] text-[#386948] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#386948] hover:text-white transition-all">View Details</button>
                 </div>
               ))}
             </div>
          </div>
        )
      case 'REPORTS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
             <div className="flex justify-between items-end mb-8">
               <div>
                <h2 className="text-3xl font-black text-[#1a2e1f] mb-1">Administrative Analytics</h2>
                <p className="text-[10px] font-black text-[#6b7280] uppercase tracking-widest">Q2 2024 Performance Overview</p>
               </div>
               <button className="bg-[#1a2e1f] px-6 py-3 rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#1a2e1f]/20">
                 <span className="material-symbols-outlined text-sm">download</span> Download PDF
               </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Compliance', value: '92%', sub: 'Target: 95%', color: 'text-[#386948]', icon: 'verified' },
                  { label: 'Rescue Rate', value: '78%', sub: '+4% vs Q1', color: 'text-blue-600', icon: 'volunteer_activism' },
                  { label: 'Wait Time', value: '14d', sub: '-2d vs average', color: 'text-orange-600', icon: 'schedule' },
                  { label: 'Active Tags', value: '3.1k', sub: '98% Signal', color: 'text-purple-600', icon: 'sensors' }
                ].map(metric => (
                  <div key={metric.label} className="bg-white p-8 rounded-[2rem] border border-[#e5e7eb] shadow-sm relative overflow-hidden group">
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-6xl text-[#f3f4f6] group-hover:text-[#f0f4ec] transition-colors">{metric.icon}</span>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6b7280] mb-3 relative z-10">{metric.label}</p>
                    <p className={`text-4xl font-black ${metric.color} mb-2 relative z-10`}>{metric.value}</p>
                    <p className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-tight relative z-10">{metric.sub}</p>
                  </div>
                ))}
             </div>

             <div className="bg-white rounded-[2.5rem] p-10 border border-[#e5e7eb] shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full bg-[#386948]"></div>
               <h3 className="text-lg font-black text-[#1a2e1f] mb-10 uppercase tracking-widest flex items-center gap-3">
                 <span className="material-symbols-outlined text-[#386948]">analytics</span>
                 Vaccination Coverage by Sitio
               </h3>
               <div className="space-y-8">
                 {[
                   { name: 'Sitio Banawa', rate: 95, color: 'bg-[#386948]' },
                   { name: 'Sitio Guadalupe', rate: 88, color: 'bg-blue-500' },
                   { name: 'Sitio Kawayan', rate: 72, color: 'bg-orange-500' },
                   { name: 'Sitio Arcenas', rate: 91, color: 'bg-purple-500' }
                 ].map(sitio => (
                   <div key={sitio.name} className="space-y-3 group">
                     <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                       <span className="text-[#1a2e1f] group-hover:text-[#386948] transition-colors">{sitio.name}</span>
                       <span className={sitio.color.replace('bg-', 'text-')}>{sitio.rate}%</span>
                     </div>
                     <div className="h-4 bg-[#f3f4f6] rounded-full overflow-hidden p-1 shadow-inner">
                       <div className={`h-full ${sitio.color} rounded-full transition-all duration-1000 shadow-sm`} style={{ width: `${sitio.rate}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="bg-[#1a2e1f] text-white rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
               <h3 className="text-xl font-black relative z-10">Advanced Heatmaps</h3>
               <p className="text-sm opacity-60 font-medium leading-relaxed relative z-10">Explore real-time stray sightings and density reports mapped across Barangay Guadalupe.</p>
               <button className="w-full py-5 bg-white text-[#1a2e1f] rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all relative z-10 shadow-xl">Launch Interactive Map</button>
             </div>
          </div>
        )
      default:
        return renderOverview()
    }
  }

  return (
    <div className="bg-[#f7f9f4] min-h-screen pb-40 font-sans antialiased">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md flex justify-between items-center px-6 h-20 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#386948] rounded-full flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-white text-xl">pets</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-[#1a2e1f] leading-none uppercase tracking-tight">Barangay Guadalupe</h1>
              <div className="relative">
                <span className="material-symbols-outlined text-sm text-[#1a2e1f] cursor-pointer hover:text-[#386948] transition-colors">notifications</span>
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </div>
            </div>
            <p className="text-[8px] text-[#6b7280] font-black uppercase tracking-widest mt-1">LGU Administrative Portal - Cebu City</p>
          </div>
        </div>
        <button 
          onClick={() => { localStorage.clear(); navigate('/') }}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#ef4444]/20 rounded-xl text-[9px] font-black text-[#ef4444] hover:bg-[#ef4444] hover:text-white transition-all uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">logout</span> Logout
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-[#e5e7eb] px-4 h-24 flex justify-around items-center z-50">
        {navItems.map(item => (
          <button 
            key={item.label} 
            onClick={() => setActiveTab(item.label.toUpperCase())}
            className={`flex flex-col items-center gap-2 transition-all px-6 py-2.5 rounded-3xl ${activeTab === item.label.toUpperCase() ? 'bg-[#eee7de] text-[#5e584f] scale-105 shadow-sm' : 'text-[#9ca3af] hover:text-[#386948]'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${activeTab === item.label.toUpperCase() ? 'fill-1' : ''}`} style={{ fontVariationSettings: activeTab === item.label.toUpperCase() ? "'FILL' 1" : "" }}>{item.icon}</span>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
