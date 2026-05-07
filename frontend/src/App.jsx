import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import RoleSelect from './pages/RoleSelect'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MyPets from './pages/MyPets'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import PetProfile from './pages/PetProfile'
import EditPet from './pages/EditPet'
import PublicPetProfile from './pages/PublicPetProfile'
import LostPet from './pages/LostPet'
import LguDashboard from './pages/LguDashboard'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/role-select" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/pets" element={<MyPets />} />
        <Route path="/dashboard/alerts" element={<Alerts />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/pet/new" element={<EditPet />} />
        <Route path="/pet/:id/edit" element={<EditPet />} />
        <Route path="/pet/:id" element={<PetProfile />} />
        <Route path="/tag/:tagId" element={<PublicPetProfile />} />
        <Route path="/lost/:id" element={<LostPet />} />
        <Route path="/lgu" element={<LguDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
