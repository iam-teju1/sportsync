# SportSync – AI Sports Tournament Organizer

**SportSync** is a modern, commercial-grade Sports Tournament Management platform built for hackathons and production tournament directors.

---

## ⚡ Key Highlights & Architecture

- **Permanent Relational Database**: Designed for Supabase PostgreSQL with relational tables (`teams`, `players`, `venues`, `referees`, `matches`, `activity_logs`), foreign keys, check constraints, and RLS policies (`supabase_schema.sql`).
- **No LocalStorage Permanent Data**: Employs a dual-driver persistent storage system (Supabase PostgreSQL client + permanent browser IndexedDB engine), ensuring instant offline testability and cloud sync without data loss.
- **Automated Standings & Point System**: Real-time standings recalculation after every recorded match score (**Win = 3 Pts, Draw = 1 Pt, Loss = 0 Pts**) with Goal Difference and Goals Scored tiebreakers.
- **Enterprise ValidateService**: Form-level validation preventing duplicate IDs, email/phone format errors, age boundaries, score negativity, and scheduling conflicts (venue double booking, referee double booking, team overlaps).
- **SearchService (Everywhere)**: Keyboard-activated modal (`Ctrl+K` / `Cmd+K`) searching across teams, players, matches, venues, referees, coaches, captains, cities, dates, and statuses.
- **Publication-Ready Reports & Export**: 1-click download of 8 distinct tournament reports in both formatted **PDF** (branded with headers, tables, pagination) and **CSV**.
- **AI Analytics & Insights Module**: Automated awards calculation (Champion, Runner Up, Golden Boot, MVP Impact Index, Best Attack/Defense, Average Goals) paired with predictive heuristic match outcomes and fair-play analytics.
- **Role-Based Access Control (RBAC)**: Switch between **ADMIN** (full CRUD, scheduling, score recording) and **VIEWER** (read-only exploration and report export).

---

## 🚀 Getting Started

### 1. Development Server
The application is currently running at:
```
http://localhost:5173/
```

### 2. Manual Start & Build Commands
Ensure Node.js is on PATH:
```powershell
$env:Path = "C:\Users\user\.gemini\antigravity\scratch\nodejs\node-v20.18.0-win-x64;" + $env:Path
Set-Location "C:\Users\user\.gemini\antigravity\scratch\sportsync"

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## 🗄️ Supabase PostgreSQL Setup

1. Open your [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor** and paste the contents of `supabase_schema.sql`.
3. Click **Run**.
4. In SportSync, click the **Supabase DB** pill in the top navigation bar.
5. Enter your **Supabase Project URL** and **Anon Key**.
6. Click **Sync Local Data to Supabase** to populate all cloud tables with tournament data.

---

## 🏆 Modules Included

1. **Dashboard**: KPI metric cards, tournament status, recent activity feed, Recharts performance and goal distribution charts.
2. **Team Module**: Team ID, name, coach, captain, city, crest logo, roster display, statistics, and delete warnings.
3. **Player Module**: Player ID, name, age, gender, position, jersey number, assigned team, match performance, cards, and eligibility status.
4. **Match Management**: Conflict-free fixture scheduling, live scoreboard, score recording, and confirmation-protected editing of completed matches.
5. **Venue Module**: Stadium ID, address, capacity, availability, and interactive booking calendar matrix.
6. **Referee Module**: Referee ID, credentials, experience, phone, email, assigned matches, and conflict avoidance.
7. **ValidateService**: Central validation engine for forms, double bookings, and business rules.
8. **SearchService**: Global search across all entities and fields.
9. **Report Generation**: 8 official reports downloadable in PDF & CSV.
10. **Analysis Module**: Automated awards podium, performance metrics, venue utilization, and AI predictive insights.
