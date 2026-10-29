# ENTC NOVA — Smart Learning & Innovation Platform

ENTC NOVA is an interactive learning platform for Electronics & Telecommunication Engineering (ENTC) students, featuring:
- **Dashboard:** Personalized learner overview, recommended lessons, recent activities, and achievement tracking.
- **Learn Library:** Bite-sized lessons with visual diagrams, key takeaways, and scored knowledge checks across Digital Logic, Microcontrollers, Communications, Signals, IoT Sensors, and Semiconductors.
- **Virtual Lab:** Real-time LED circuit and Logic Gate simulators based on Ohm's law and Boolean algebra.
- **Circuit Doctor:** Interactive troubleshooting diagnostic cases with simulated oscilloscope and multimeter readings.
- **Challenge Arena:** Timed and practice quizzes covering electronics fundamentals and Arduino programming.
- **Innovation Studio:** Real-world smart system simulations (Smart Irrigation, Pulse Oximeter, Traffic Light Controller).
- **NOVA AI:** Conversational learning assistant with offline knowledge fallback.
- **Progress Tracking:** Persistent points, achievements, and level progression saved in local storage and synced with the database.

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Sonner Toaster
- **Database:** Prisma ORM with SQLite (`db/custom.db`) or PostgreSQL / Supabase
- **Backend API Routes:**
  - `GET /api/health` — System and database health diagnostic
  - `GET /api/progress` — Fetch persisted learner progress from database
  - `POST /api/progress` — Save and synchronize progress to database
  - `DELETE /api/progress` — Reset learner progress
  - `POST /api/lab` — Record lab simulation telemetry
  - `POST /api/nova` — AI assistant with offline fallback engine

---

## 🚀 Quick Start

### Option 1: One-Click Launch (Windows)
Double-click **`run.bat`** (or `start.bat`) in the project root.
This will automatically verify dependencies, sync the database, start the Next.js server, and open `http://localhost:3000`.

### Option 2: Terminal
```sh
# 1. Install dependencies
npm install

# 2. Push Prisma database schema
npx prisma db push

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄 Database Configuration

By default, the project uses local SQLite at `db/custom.db`:
```env
DATABASE_URL="file:./db/custom.db"
```

To switch to **PostgreSQL** or **Supabase**:
1. Update `prisma/schema.prisma` datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your Supabase connection string in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres"
   ```
3. Run `npx prisma db push`.
