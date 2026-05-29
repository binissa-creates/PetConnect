import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import petRoutes from './routes/pets.js'
import alertRoutes from './routes/alerts.js'
import publicRoutes from './routes/public.js'
import lguRoutes from './routes/lgu.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/pets', petRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/lgu', lguRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'PetConnect Backend Running!' }))

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
