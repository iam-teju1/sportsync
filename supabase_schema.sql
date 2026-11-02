-- =========================================================
-- SportSync – AI Sports Tournament Organizer
-- Supabase PostgreSQL Relational Database Schema
-- =========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if needed in reverse dependency order
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS referees CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS tournament_settings CASCADE;

-- 1. TEAMS TABLE
CREATE TABLE teams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    coach VARCHAR(100) NOT NULL,
    captain VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    logo TEXT,
    description TEXT,
    registered_date DATE DEFAULT CURRENT_DATE,
    wins INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    goals_for INTEGER DEFAULT 0,
    goals_against INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. VENUES TABLE
CREATE TABLE venues (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    availability VARCHAR(50) DEFAULT 'Available' CHECK (availability IN ('Available', 'Booked', 'Maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REFEREES TABLE
CREATE TABLE referees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,
    assigned_matches INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PLAYERS TABLE (Relational Link: Player belongs to one Team)
CREATE TABLE players (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 14 AND age <= 60),
    gender VARCHAR(20) NOT NULL,
    position VARCHAR(50) NOT NULL CHECK (position IN ('Forward', 'Midfielder', 'Defender', 'Goalkeeper')),
    jersey_number INTEGER NOT NULL CHECK (jersey_number > 0 AND jersey_number <= 99),
    team_id VARCHAR(50) REFERENCES teams(id) ON DELETE SET NULL,
    goals INTEGER DEFAULT 0 CHECK (goals >= 0),
    assists INTEGER DEFAULT 0 CHECK (assists >= 0),
    matches_played INTEGER DEFAULT 0 CHECK (matches_played >= 0),
    yellow_cards INTEGER DEFAULT 0 CHECK (yellow_cards >= 0),
    red_cards INTEGER DEFAULT 0 CHECK (red_cards >= 0),
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Injured', 'Suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MATCHES TABLE (Relational Links: Home/Away teams, Venue, Referee)
CREATE TABLE matches (
    id VARCHAR(50) PRIMARY KEY,
    home_team_id VARCHAR(50) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    away_team_id VARCHAR(50) NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    venue_id VARCHAR(50) NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
    referee_id VARCHAR(50) NOT NULL REFERENCES referees(id) ON DELETE RESTRICT,
    match_date DATE NOT NULL,
    match_time VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Live', 'Completed', 'Cancelled')),
    home_score INTEGER DEFAULT 0 CHECK (home_score >= 0),
    away_score INTEGER DEFAULT 0 CHECK (away_score >= 0),
    winner_team_id VARCHAR(50) REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT chk_different_teams CHECK (home_team_id <> away_team_id)
);

-- 6. ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TOURNAMENT SETTINGS TABLE
CREATE TABLE tournament_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_venue ON matches(venue_id);
CREATE INDEX idx_matches_referee ON matches(referee_id);
CREATE INDEX idx_matches_status ON matches(status);

-- Enable Row Level Security (RLS) but allow public read & write for configured clients
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on teams" ON teams FOR ALL USING (true);

CREATE POLICY "Allow public read access on venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on venues" ON venues FOR ALL USING (true);

CREATE POLICY "Allow public read access on referees" ON referees FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on referees" ON referees FOR ALL USING (true);

CREATE POLICY "Allow public read access on players" ON players FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on players" ON players FOR ALL USING (true);

CREATE POLICY "Allow public read access on matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on matches" ON matches FOR ALL USING (true);

CREATE POLICY "Allow public read access on activity_logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on activity_logs" ON activity_logs FOR ALL USING (true);

CREATE POLICY "Allow public read access on tournament_settings" ON tournament_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete on tournament_settings" ON tournament_settings FOR ALL USING (true);
