# PetConnect

Smart pet ID platform for Lahug, Cebu City — NFC/QR tags, lost pet alerts, LGU dashboard, and adoption listings.

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) with **MySQL/MariaDB** running
- [Node.js](https://nodejs.org/) 18+

## Setup

1. **Import the database** in phpMyAdmin:
   - Create database `petconnect`
   - Import your SQL dump (or use the provided schema files)

2. **Install dependencies** (from project root):
   ```bash
   npm run install-all
   ```

3. **Configure backend** — copy `backend/.env.example` to `backend/.env` if needed:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=petconnect
   ```

4. **Reset demo account passwords** (run once after importing SQL):
   ```bash
   cd backend
   npm run setup-db
   ```

## Run the app

From the project root:

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api

Or run separately:
```bash
npm run backend    # API only
npm run frontend   # Vite dev server only
```

## Demo accounts

Password for all seed accounts: **Password123**

| Role | Email |
|------|-------|
| Pet Owner | `owner@petconnect.com` |
| Pet Owner | `maria@petconnect.com` |
| LGU Admin | `admin@petconnect.com` |
| LGU Admin | `admin@cebu.gov.ph` |

## Public pages (no login required)

| Page | URL |
|------|-----|
| Lost Pet Board | http://localhost:5173/community/lost |
| Adoption Gallery | http://localhost:5173/adoptions |
| Tag scan (example) | http://localhost:5173/tag/PTC-7741-B |

## Troubleshooting

- **"Connection Refused" on login** — Backend is not running. Start with `npm run dev` or `npm run backend`.
- **"Invalid credentials"** — Run `npm run setup-db` in the backend folder to reset passwords.
- **Database connection failed** — Start MySQL in XAMPP and verify the `petconnect` database exists.
