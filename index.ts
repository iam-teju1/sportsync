export type PlayerPosition = 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
export type PlayerStatus = 'Active' | 'Injured' | 'Suspended';
export type MatchStatus = 'Scheduled' | 'Live' | 'Completed' | 'Cancelled';
export type VenueAvailability = 'Available' | 'Booked' | 'Maintenance';
export type RefereeStatus = 'Active' | 'On Leave' | 'Suspended';
export type UserRole = 'ADMIN' | 'VIEWER';

export interface Team {
  id: string; // e.g., "TM-01"
  name: string;
  coach: string;
  captain: string;
  city: string;
  logo: string;
  description: string;
  registeredDate: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface Player {
  id: string; // e.g., "PL-01"
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  position: PlayerPosition;
  jerseyNumber: number;
  teamId: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
  yellowCards: number;
  redCards: number;
  status: PlayerStatus;
}

export interface Venue {
  id: string; // e.g., "VN-01"
  name: string;
  address: string;
  city: string;
  capacity: number;
  availability: VenueAvailability;
}

export interface Referee {
  id: string; // e.g., "RF-01"
  name: string;
  experience: number; // in years
  phone: string;
  email: string;
  assignedMatches: number;
  status: RefereeStatus;
}

export interface Match {
  id: string; // e.g., "MT-01"
  homeTeamId: string;
  awayTeamId: string;
  venueId: string;
  refereeId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  winnerId?: string | 'DRAW';
}

export interface StandingsRow {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface ActivityLog {
  id: string;
  actionType: 'MATCH_SCORE' | 'MATCH_SCHEDULED' | 'TEAM_ADDED' | 'PLAYER_ADDED' | 'VENUE_UPDATED' | 'REFEREE_ASSIGNED';
  title: string;
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}
