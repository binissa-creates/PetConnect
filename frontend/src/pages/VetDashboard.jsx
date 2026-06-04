import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getVetStats, getVetPatients, searchPatientByTag, addVaccination, addMedicalRecord } from '../services/api'

export default function VetDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  const [stats, setStats] = useState({ total_patients: 0, total_vaccinations: 0, total_treatments: 0 })
  const [patients, setPatients] = useState([])
  const [searchTag, setSearchTag] = useState('')
  const [patientDetails, setPatientDetails] = useState(null)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard', 'add-record'
  const [recordType, setRecordType] = useState('vaccine') // 'vaccine', 'medical'

  // Record Forms
  const [vaxForm, setVaxForm] = useState({
    pet_id: '',
    vaccine_name: '',
    date_given: new Date().toISOString().split('T')[0],
    next_due_date: '',
    clinic_name: user.clinic_name || '',
    batch_number: '',
    notes: ''
  })

  const [medForm, setMedForm] = useState({
    pet_id: '',
    record_type: 'checkup',
    title: '',
    description: '',
    diagnosis: '',
    treatment: '',
    record_date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchStats()
    fetchPatients()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await getVetStats()
      setStats(res.data)
    } catch (err) {
      console.error('Failed to fetch vet stats:', err)
      // Fallback for demo
      setStats({ total_patients: 3, total_vaccinations: 5, total_treatments: 2 })
    }
  }

  const fetchPatients = async () => {
    try {
      const res = await getVetPatients()
      setPatients(res.data)
    } catch (err) {
      console.error('Failed to fetch patients:', err)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTag.trim()) return
    setLoading(true)
    setError('')
    setPatientDetails(null)
    
    try {
      const res = await searchPatientByTag(searchTag.trim())
      setPatientDetails(res.data)
      // Autofill pet_id in forms
      setVaxForm(prev => ({ ...prev, pet_id: res.data.id }))
      setMedForm(prev => ({ ...prev, pet_id: res.data.id }))
    } catch (err) {
      setError(err.response?.data?.message || 'Patient not found. Verify the Tag ID.')
    } finally {
      setLoading(false)
    }
  }

  const handleVaxSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await addVaccination(vaxForm)
      setSuccess('Vaccination recorded successfully!')
      fetchStats()
      // Reset form (except pet_id and clinic_name)
      setVaxForm(prev => ({
        ...prev,
        vaccine_name: '',
        date_given: new Date().toISOString().split('T')[0],
        next_due_date: '',
        batch_number: '',
        notes: ''
      }))
      if (searchTag) {
        // Refresh details
        const res = await searchPatientByTag(searchTag.trim())
        setPatientDetails(res.data)
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vaccination record.')
    } finally {
      setLoading(false)
    }
  }

  const handleMedSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await addMedicalRecord(medForm)
      setSuccess('Medical record added successfully!')
      fetchStats()
      setMedForm(prev => ({
        ...prev,
        record_type: 'checkup',
        title: '',
        description: '',
        diagnosis: '',
        treatment: '',
        record_date: new Date().toISOString().split('T')[0]
      }))
      if (searchTag) {
        // Refresh details
        const res = await searchPatientByTag(searchTag.trim())
        setPatientDetails(res.data)
      }
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medical record.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className="bg-surface min-h-screen pb-24 font-sans selection:bg-primary-container selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container/30 soft-shadow h-[72px] flex items-center">
        <div className="flex justify-between items-center px-6 md:px-10 max-w-7xl mx-auto w-full">
          <Link to="/" className="text-2xl font-serif-elegant font-bold text-on-surface flex items-center gap-2 group transition-colors">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform duration-300">pets</span>
            <span className="text-gradient">PetConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-on-surface">{user.name}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{user.clinic_name || 'Veterinary Partner'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors uppercase tracking-widest border border-surface-container px-3 py-2 rounded-xl"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[100px] px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar/Panel: Tab Switcher & Stats */}
        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-surface-container/50 shadow-sm space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-3 transition-all ${activeTab === 'dashboard' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low/50'}`}
            >
              <span className="material-symbols-outlined">dashboard</span>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-3 transition-all ${activeTab === 'search' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low/50'}`}
            >
              <span className="material-symbols-outlined">qr_code_scanner</span>
              Scan / Search Tag
            </button>
          </div>

          {/* Clinical Stats */}
          <div className="bg-white rounded-[2rem] p-8 border border-surface-container/50 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brown-gradient"></div>
            <h3 className="font-serif-elegant font-bold text-on-surface text-lg">Clinic Stats</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-surface-container/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">groups</span>
                  <span className="text-xs font-semibold text-on-surface-variant">Patients Seen</span>
                </div>
                <span className="text-lg font-bold text-primary">{stats.total_patients}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-surface-container/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">vaccines</span>
                  <span className="text-xs font-semibold text-on-surface-variant">Vaccinations</span>
                </div>
                <span className="text-lg font-bold text-tertiary">{stats.total_vaccinations}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-surface-container/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">assignment</span>
                  <span className="text-xs font-semibold text-on-surface-variant">Medical Logs</span>
                </div>
                <span className="text-lg font-bold text-secondary">{stats.total_treatments}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel: Content Area */}
        <section className="lg:col-span-9 space-y-8">
          
          {/* Success / Error toasts */}
          {success && (
            <div className="p-4 bg-tertiary-container/30 border border-tertiary/20 rounded-2xl text-tertiary text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in zoom-in duration-300">
              <span className="material-symbols-outlined text-lg">verified</span>
              {success}
            </div>
          )}
          {error && (
            <div className="p-4 bg-error/5 border border-error/20 rounded-2xl text-error text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in zoom-in duration-300">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-surface-container/50 shadow-sm">
                <h2 className="text-2xl font-serif-elegant font-bold text-on-surface mb-6">Patient Registry</h2>
                <p className="text-sm text-on-surface-variant font-light mb-8">List of pets registered or serviced under your credentials.</p>
                
                {patients.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-surface-container rounded-3xl space-y-4">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">medical_information</span>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">No patient records found yet</p>
                    <button 
                      onClick={() => setActiveTab('search')} 
                      className="px-6 py-3 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-primary/95 transition-all"
                    >
                      Scan a tag to start
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {patients.map(p => (
                      <div key={p.id} className="premium-card p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={p.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=100'} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                          <div>
                            <h4 className="font-bold text-on-surface text-sm">{p.name}</h4>
                            <p className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{p.breed || p.species}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSearchTag(p.tag_id)
                            setActiveTab('search')
                            // autotrigger fetch
                            searchPatientByTag(p.tag_id).then(res => {
                              setPatientDetails(res.data)
                              setVaxForm(prev => ({ ...prev, pet_id: res.data.id }))
                              setMedForm(prev => ({ ...prev, pet_id: res.data.id }))
                            })
                          }}
                          className="px-3 py-2 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-semibold text-primary transition-all"
                        >
                          View Charts
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              {/* Tag Search Form */}
              <div className="bg-white rounded-[2rem] p-8 border border-surface-container/50 shadow-sm space-y-6">
                <h2 className="text-2xl font-serif-elegant font-bold text-on-surface">Scan / Search Tag ID</h2>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <input
                    type="text"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    placeholder="Enter Pet Tag ID (e.g. PTC-8829-X)"
                    className="flex-1 bg-surface-container-low border border-surface-container rounded-2xl p-4 text-base font-bold tracking-widest text-on-surface placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-4 focus:ring-primary/5"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 bg-brown-gradient text-on-primary rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Search'}
                  </button>
                </form>
              </div>

              {/* Patient Details & Logs */}
              {patientDetails && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                  {/* Patient Info Card */}
                  <div className="lg:col-span-4 bg-white rounded-[2rem] p-8 border border-surface-container/50 shadow-sm flex flex-col items-center text-center gap-6">
                    <img src={patientDetails.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'} className="w-32 h-32 rounded-[2rem] object-cover shadow-md" alt="" />
                    <div>
                      <h3 className="text-xl font-serif-elegant font-bold text-on-surface">{patientDetails.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{patientDetails.breed || patientDetails.species}</p>
                    </div>
                    
                    <div className="w-full space-y-3 pt-4 border-t border-surface-container/50 text-left">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Owner</span>
                        <span className="font-bold text-on-surface">{patientDetails.owner_name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Phone</span>
                        <span className="font-bold text-on-surface">{patientDetails.owner_phone || 'None'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Microchip</span>
                        <span className="font-bold text-on-surface">{patientDetails.microchip_id || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">NFC Tag</span>
                        <span className="font-bold text-primary tracking-widest">{patientDetails.tag_id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Log Action Forms & Timelines */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Add records */}
                    <div className="bg-white rounded-[2rem] p-8 border border-surface-container/50 shadow-sm">
                      <div className="flex gap-4 mb-6 border-b border-surface-container/30 pb-4">
                        <button
                          onClick={() => setRecordType('vaccine')}
                          className={`pb-2 text-xs font-bold uppercase tracking-wider ${recordType === 'vaccine' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}
                        >
                          Log Vaccination
                        </button>
                        <button
                          onClick={() => setRecordType('medical')}
                          className={`pb-2 text-xs font-bold uppercase tracking-wider ${recordType === 'medical' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}
                        >
                          Log Medical Record
                        </button>
                      </div>

                      {recordType === 'vaccine' ? (
                        <form onSubmit={handleVaxSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Vaccine Name</label>
                              <input required type="text" value={vaxForm.vaccine_name} onChange={(e) => setVaxForm({...vaxForm, vaccine_name: e.target.value})} placeholder="e.g. Anti-Rabies" className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Batch Number</label>
                              <input type="text" value={vaxForm.batch_number} onChange={(e) => setVaxForm({...vaxForm, batch_number: e.target.value})} placeholder="e.g. B8929A" className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date Administered</label>
                              <input required type="date" value={vaxForm.date_given} onChange={(e) => setVaxForm({...vaxForm, date_given: e.target.value})} className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Booster Due Date</label>
                              <input type="date" value={vaxForm.next_due_date} onChange={(e) => setVaxForm({...vaxForm, next_due_date: e.target.value})} className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Clinic Name</label>
                            <input required type="text" value={vaxForm.clinic_name} onChange={(e) => setVaxForm({...vaxForm, clinic_name: e.target.value})} className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Notes / Comments</label>
                            <textarea rows="2" value={vaxForm.notes} onChange={(e) => setVaxForm({...vaxForm, notes: e.target.value})} placeholder="Describe pet condition, booster notes, etc." className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs resize-none" />
                          </div>

                          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow transition-all">
                            Save Vaccination Record
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleMedSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Diagnosis/Title</label>
                              <input required type="text" value={medForm.title} onChange={(e) => setMedForm({...medForm, title: e.target.value})} placeholder="e.g. Annual Deworming" className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Record Type</label>
                              <select value={medForm.record_type} onChange={(e) => setMedForm({...medForm, record_type: e.target.value})} className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs">
                                <option value="checkup">Routine Checkup</option>
                                <option value="treatment">Treatment / Medicine</option>
                                <option value="surgery">Surgery</option>
                                <option value="diagnosis">Clinical Diagnosis</option>
                                <option value="lab_result">Lab / Blood Test</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Clinical Description</label>
                            <textarea rows="2" value={medForm.description} onChange={(e) => setMedForm({...medForm, description: e.target.value})} placeholder="Provide clinical observations, weight, vitals..." className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs resize-none" />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Prescription/Treatment</label>
                              <input type="text" value={medForm.treatment} onChange={(e) => setMedForm({...medForm, treatment: e.target.value})} placeholder="Medicines, dosage instructions" className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Record Date</label>
                              <input required type="date" value={medForm.record_date} onChange={(e) => setMedForm({...medForm, record_date: e.target.value})} className="w-full bg-surface-container-low border border-surface-container rounded-xl p-3 text-xs" />
                            </div>
                          </div>

                          <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-xl hover:shadow transition-all">
                            Save Medical Record
                          </button>
                        </form>
                      )}
                    </div>

                    {/* Historical Timelines */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-surface-container/50 shadow-sm space-y-6">
                      <h3 className="font-serif-elegant font-bold text-on-surface text-lg">Health History</h3>
                      
                      {patientDetails.vaccinations?.length === 0 && patientDetails.medicalRecords?.length === 0 ? (
                        <p className="text-xs text-on-surface-variant/60">No health history logs found for this patient.</p>
                      ) : (
                        <div className="relative border-l border-surface-container pl-6 space-y-6 ml-2">
                          {/* Vaccinations */}
                          {patientDetails.vaccinations?.map((v, i) => (
                            <div key={`v-${i}`} className="relative">
                              <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center border border-white shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">vaccines</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest">Vaccination</span>
                                <h4 className="text-sm font-bold text-on-surface leading-tight mt-0.5">{v.vaccine_name}</h4>
                                <p className="text-xs text-on-surface-variant font-light mt-1">Given on {new Date(v.date_given).toLocaleDateString()} • {v.clinic_name || 'Clinic'}</p>
                                {v.notes && <p className="text-[11px] bg-surface p-2.5 rounded-xl border mt-2 text-on-surface-variant italic font-light">"{v.notes}"</p>}
                              </div>
                            </div>
                          ))}

                          {/* Medical Records */}
                          {patientDetails.medicalRecords?.map((m, i) => (
                            <div key={`m-${i}`} className="relative">
                              <div className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-secondary-container text-secondary flex items-center justify-center border border-white shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">assignment</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">{m.record_type}</span>
                                <h4 className="text-sm font-bold text-on-surface leading-tight mt-0.5">{m.title}</h4>
                                <p className="text-xs text-on-surface-variant font-light mt-1">Logged on {new Date(m.record_date).toLocaleDateString()} • {m.clinic_name || 'Clinic'}</p>
                                {m.description && <p className="text-xs text-on-surface-variant mt-2 font-light leading-relaxed">{m.description}</p>}
                                {m.treatment && (
                                  <div className="bg-surface p-3 border rounded-xl mt-3">
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Prescription</p>
                                    <p className="text-xs font-semibold text-on-surface leading-normal">{m.treatment}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </section>
      </main>
    </div>
  )
}
