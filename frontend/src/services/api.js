import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ────────────────────────────────────────────────
export const login    = data => API.post('/auth/login', data)
export const register = data => API.post('/auth/register', data)

// ── Pets ────────────────────────────────────────────────
export const getPets     = ()         => API.get('/pets')
export const getPet      = id         => API.get(`/pets/${id}`)
export const createPet   = data       => API.post('/pets', data)
export const updatePet   = (id, data) => API.put(`/pets/${id}`, data)
export const deletePet   = id         => API.delete(`/pets/${id}`)

// ── Public tag scan ─────────────────────────────────────
export const getPublicTag = tagId => API.get(`/public/tag/${tagId}`)

// ── Alerts ──────────────────────────────────────────────
export const getAlerts   = ()         => API.get('/alerts')
export const markRead    = id         => API.patch(`/alerts/${id}/read`)

// ── Lost pets ───────────────────────────────────────────
export const getLostPets  = ()         => API.get('/lost')
export const reportLost   = id         => API.post(`/pets/${id}/lost`)
export const resolvedLost = id         => API.post(`/pets/${id}/found`)

// ── LGU Dashboard ───────────────────────────────────────
export const getLguStats  = ()         => API.get('/lgu/stats')
export const getLguAlerts = ()         => API.get('/lgu/alerts')

export default API
