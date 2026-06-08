# PetConnect Project Summary

**PetConnect** is a full-stack pet identification and safety platform designed for Lahug, Cebu City, featuring smart NFC/QR tags that provide instant access to digital pet profiles.

## 🏗️ Architecture

### Monorepo Structure
```
PetConnect/
├── backend/          # Express.js API server
│   ├── index.js      # Main server entry (port 5000)
│   ├── db.js         # MySQL connection pool
│   ├── middleware/   # Authentication middleware
│   └── routes/       # API route handlers
│       ├── auth.js   # User registration, login, profile
│       ├── pets.js   # Pet CRUD operations, lost/found reporting
│       ├── alerts.js # Notification management
│       ├── public.js # Public tag scanning endpoints
│       └── lgu.js    # LGU dashboard statistics
├── frontend/         # React SPA (Vite)
│   ├── src/
│   │   ├── pages/    # Route components (10 pages)
│   │   ├── components/ # Reusable UI components
│   │   └── services/ # API client configuration
│   └── dist/         # Production build output
└── petconnect_lahug.sql # Database schema and seed data
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, Vite 8, Axios |
| **Backend** | Express 5, MySQL 2, JWT, bcrypt.js, dotenv |
| **Maps** | Leaflet + React-Leaflet |
| **Build** | concurrently (dev mode) |

## 📊 Database Schema

- **users**: id, name, email, phone, password, role (owner/lgu/admin), email_alerts, sms_alerts
- **pets**: id, owner_id, tag_id (PTC-XXXX-X format), name, species, breed, age, weight, color, photo_url, medical_conditions, vaccines (JSON), marking_images (JSON), status (healthy/lost/deceased), address, hide_phone
- **alerts**: id, pet_id, type (scan/medical/lost), title, message, latitude, longitude, is_read, created_at

## 🎯 Core Features

### For Pet Owners
1. **Dashboard** - Pet overview with activity feed and lost pet alerts
2. **Pet Profiles** - Detailed view with QR codes, medical records, vaccines
3. **Edit Pet** - Photo upload, vaccine tracking, marking images (up to 4)
4. **Alerts Center** - Timeline view with map integration for scan locations
5. **Settings** - Profile management, notification preferences

### For LGU (Local Government Unit) Staff
1. **LguDashboard** - Community statistics, adoption pipeline, reports
2. **Public Tag Scanning** - Anyone can scan a tag to view pet info and contact owner
3. **Lost Pet Reports** - Track missing pets in the jurisdiction

## 🌐 API Endpoints

```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Authenticate
PUT    /api/auth/profile      - Update profile

GET    /api/pets              - Get user's pets
GET    /api/pets/:id          - Get specific pet
POST   /api/pets              - Create pet
PUT    /api/pets/:id          - Update pet
POST   /api/pets/:id/lost     - Report pet lost
POST   /api/pets/:id/found    - Mark pet found

GET    /api/alerts            - Get notifications
PATCH  /api/alerts/:id/read   - Mark as read

GET    /api/public/tag/:tagId  - Public profile lookup (no auth)
POST   /api/public/scan/:tagId - Record scan with GPS

GET    /api/lgu/stats         - Dashboard statistics
GET    /api/lgu/alerts        - Lost pets list
```

## 🎨 Design System

The project uses a **"Verdant Harmony"** design system:
- **Primary**: Forest green (#386948) for actions/branding
- **Secondary**: Warm taupe (#665e53) for supporting elements  
- **Tertiary**: Muted gold (#745c27) for accents
- **Typography**: Public Sans (fallback to system fonts)
- **Rounded corners**: Level 2 (8-24px radius)
- **Material Symbols** icons throughout

## 🚀 Getting Started

```bash
# Install all dependencies
npm run install-all

# Development mode (backend + frontend)
npm run dev

# Backend only
npm run backend

# Frontend only
npm run frontend
```

## 📱 Key Pages & Routes

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Landing | Marketing/page intro |
| `/role-select` | RoleSelect | Choose owner/LGU flow |
| `/login` | Login | Authentication |
| `/register` | Register | 4-step pet registration |
| `/dashboard` | Dashboard | Main pet owner dashboard |
| `/dashboard/pets` | MyPets | Pet list/grid |
| `/dashboard/alerts` | Alerts | Notification center |
| `/dashboard/settings` | Settings | Profile management |
| `/pet/new` | EditPet | Create new pet |
| `/pet/:id/edit` | EditPet | Edit existing pet |
| `/pet/:id` | PetProfile | Pet detail view |
| `/tag/:tagId` | PublicPetProfile | Public scan page |
| `/lost/:id` | LostPet | Lost pet emergency view |
| `/lgu` | LguDashboard | LGU admin panel |

## 🔧 Recent Changes (Git History)

- Enhanced pet management with vaccine and marking image support
- ScrollToTop component for navigation consistency
- Improved error handling and UI adjustments across pages
- RoleSelect and Settings page refinements

## 📍 Deployment

Configured for **Vercel** with SPA rewrites to `frontend/dist`. Backend expects MySQL database access via environment variables.