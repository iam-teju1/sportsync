import { Team, Player, Venue, Referee, Match, ActivityLog } from '../types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: "TM-01",
    name: "Karasuno Crows",
    coach: "Coach Ukai",
    captain: "Daichi Sawamura",
    city: "Sendai",
    logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=80",
    description: "High-flying, dynamic attacking squad specializing in fast transitions and synchronized quick strikes.",
    registeredDate: "2026-09-01",
    wins: 4,
    draws: 1,
    losses: 1,
    goalsFor: 14,
    goalsAgainst: 6,
    points: 13
  },
  {
    id: "TM-02",
    name: "Nekoma Cats",
    coach: "Coach Nekomata",
    captain: "Tetsuro Kuroo",
    city: "Tokyo",
    logo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=128&auto=format&fit=crop&q=80",
    description: "Tactical defense and ball-retrieval specialists known for flexible positioning and counter-attacks.",
    registeredDate: "2026-09-02",
    wins: 3,
    draws: 2,
    losses: 1,
    goalsFor: 11,
    goalsAgainst: 5,
    points: 11
  },
  {
    id: "TM-03",
    name: "Blue Lock FC",
    coach: "Coach Ego Jinpachi",
    captain: "Rin Itoshi",
    city: "Tokyo",
    logo: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=128&auto=format&fit=crop&q=80",
    description: "Hyper-aggressive offensive playmakers driven by spatial awareness and direct finishing.",
    registeredDate: "2026-09-05",
    wins: 3,
    draws: 1,
    losses: 2,
    goalsFor: 10,
    goalsAgainst: 8,
    points: 10
  },
  {
    id: "TM-04",
    name: "Seirin Falcons",
    coach: "Coach Riko Aida",
    captain: "Junpei Hyuga",
    city: "Kyoto",
    logo: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=128&auto=format&fit=crop&q=80",
    description: "High-tempo transition unit with relentless team chemistry, perimeter shooting, and speed.",
    registeredDate: "2026-09-06",
    wins: 2,
    draws: 2,
    losses: 2,
    goalsFor: 8,
    goalsAgainst: 9,
    points: 8
  },
  {
    id: "TM-05",
    name: "Inazuma Eleven",
    coach: "Coach Seigou Hibiki",
    captain: "Mamoru Endo",
    city: "Osaka",
    logo: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?w=128&auto=format&fit=crop&q=80",
    description: "Spirited team known for high-octane set-pieces, physical resilience, and unbreakable teamwork.",
    registeredDate: "2026-09-07",
    wins: 1,
    draws: 2,
    losses: 3,
    goalsFor: 6,
    goalsAgainst: 11,
    points: 5
  },
  {
    id: "TM-06",
    name: "Fukurodani Owls",
    coach: "Coach Takeyuki",
    captain: "Kotaro Bokuto",
    city: "Nagoya",
    logo: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=128&auto=format&fit=crop&q=80",
    description: "Explosive metropolitan powerhouse with sharp cross-field attacks and aerial dominance.",
    registeredDate: "2026-09-10",
    wins: 0,
    draws: 2,
    losses: 4,
    goalsFor: 4,
    goalsAgainst: 13,
    points: 2
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: "VN-01",
    name: "Tokyo National Stadium",
    address: "10 Kasumigaokamachi, Shinjuku",
    city: "Tokyo",
    capacity: 68000,
    availability: "Available"
  },
  {
    id: "VN-02",
    name: "Osaka Sports Dome",
    address: "3 Chome-Chiyozaki, Nishi Ward",
    city: "Osaka",
    capacity: 55000,
    availability: "Available"
  },
  {
    id: "VN-03",
    name: "Sakura Arena",
    address: "1-1 Sakuragaoka, Shibuya",
    city: "Tokyo",
    capacity: 32000,
    availability: "Available"
  },
  {
    id: "VN-04",
    name: "Fuji Sports Complex",
    address: "88 Mount Fuji Way",
    city: "Shizuoka",
    capacity: 28000,
    availability: "Available"
  }
];

export const INITIAL_REFEREES: Referee[] = [
  {
    id: "RF-01",
    name: "Hiroshi Ito",
    experience: 12,
    phone: "+81-3-5555-0192",
    email: "h.ito@sportsync.jp",
    assignedMatches: 4,
    status: "Active"
  },
  {
    id: "RF-02",
    name: "Masato Kobayashi",
    experience: 15,
    phone: "+81-6-5555-0482",
    email: "m.kobayashi@sportsync.jp",
    assignedMatches: 5,
    status: "Active"
  },
  {
    id: "RF-03",
    name: "Shun Ogawa",
    experience: 8,
    phone: "+81-75-5555-0771",
    email: "s.ogawa@sportsync.jp",
    assignedMatches: 4,
    status: "Active"
  },
  {
    id: "RF-04",
    name: "Yusuke Endo",
    experience: 10,
    phone: "+81-92-5555-0994",
    email: "y.endo@sportsync.jp",
    assignedMatches: 3,
    status: "Active"
  }
];

export const INITIAL_PLAYERS: Player[] = [
  // Karasuno Crows (TM-01)
  { id: "PL-01", name: "Shoyo Hinata", age: 16, gender: "Male", position: "Forward", jerseyNumber: 10, teamId: "TM-01", goals: 7, assists: 3, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" },
  { id: "PL-02", name: "Tobio Kageyama", age: 16, gender: "Male", position: "Midfielder", jerseyNumber: 9, teamId: "TM-01", goals: 3, assists: 5, matchesPlayed: 6, yellowCards: 2, redCards: 0, status: "Active" },
  { id: "PL-03", name: "Daichi Sawamura", age: 18, gender: "Male", position: "Defender", jerseyNumber: 1, teamId: "TM-01", goals: 1, assists: 1, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },
  { id: "PL-04", name: "Yu Nishinoya", age: 17, gender: "Male", position: "Goalkeeper", jerseyNumber: 4, teamId: "TM-01", goals: 0, assists: 0, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },
  { id: "PL-05", name: "Ryunosuke Tanaka", age: 17, gender: "Male", position: "Forward", jerseyNumber: 5, teamId: "TM-01", goals: 3, assists: 2, matchesPlayed: 5, yellowCards: 1, redCards: 0, status: "Active" },

  // Nekoma Cats (TM-02)
  { id: "PL-06", name: "Tetsuro Kuroo", age: 18, gender: "Male", position: "Defender", jerseyNumber: 1, teamId: "TM-02", goals: 2, assists: 0, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" },
  { id: "PL-07", name: "Kenma Kozume", age: 17, gender: "Male", position: "Midfielder", jerseyNumber: 5, teamId: "TM-02", goals: 5, assists: 2, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },
  { id: "PL-08", name: "Lev Haiba", age: 16, gender: "Male", position: "Forward", jerseyNumber: 11, teamId: "TM-02", goals: 2, assists: 4, matchesPlayed: 6, yellowCards: 3, redCards: 0, status: "Active" },
  { id: "PL-09", name: "Morisuke Yaku", age: 18, gender: "Male", position: "Goalkeeper", jerseyNumber: 3, teamId: "TM-02", goals: 0, assists: 0, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },

  // Blue Lock FC (TM-03)
  { id: "PL-10", name: "Yoichi Isagi", age: 17, gender: "Male", position: "Forward", jerseyNumber: 11, teamId: "TM-03", goals: 4, assists: 4, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" },
  { id: "PL-11", name: "Meguru Bachira", age: 17, gender: "Male", position: "Midfielder", jerseyNumber: 8, teamId: "TM-03", goals: 4, assists: 1, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },
  { id: "PL-12", name: "Rin Itoshi", age: 16, gender: "Male", position: "Forward", jerseyNumber: 10, teamId: "TM-03", goals: 1, assists: 0, matchesPlayed: 5, yellowCards: 2, redCards: 0, status: "Active" },
  { id: "PL-13", name: "Gin Gagamaru", age: 18, gender: "Male", position: "Goalkeeper", jerseyNumber: 1, teamId: "TM-03", goals: 0, assists: 0, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },

  // Seirin Falcons (TM-04)
  { id: "PL-14", name: "Taiga Kagami", age: 16, gender: "Male", position: "Forward", jerseyNumber: 10, teamId: "TM-04", goals: 4, assists: 1, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" },
  { id: "PL-15", name: "Tetsuya Kuroko", age: 16, gender: "Male", position: "Midfielder", jerseyNumber: 11, teamId: "TM-04", goals: 2, assists: 3, matchesPlayed: 6, yellowCards: 0, redCards: 0, status: "Active" },
  { id: "PL-16", name: "Teppei Kiyoshi", age: 17, gender: "Male", position: "Defender", jerseyNumber: 7, teamId: "TM-04", goals: 1, assists: 0, matchesPlayed: 6, yellowCards: 2, redCards: 1, status: "Suspended" },

  // Inazuma Eleven (TM-05)
  { id: "PL-17", name: "Mamoru Endo", age: 16, gender: "Male", position: "Goalkeeper", jerseyNumber: 1, teamId: "TM-05", goals: 2, assists: 1, matchesPlayed: 6, yellowCards: 4, redCards: 0, status: "Active" },
  { id: "PL-18", name: "Shuya Goenji", age: 16, gender: "Male", position: "Forward", jerseyNumber: 10, teamId: "TM-05", goals: 3, assists: 1, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" },

  // Fukurodani Owls (TM-06)
  { id: "PL-19", name: "Kotaro Bokuto", age: 18, gender: "Male", position: "Forward", jerseyNumber: 4, teamId: "TM-06", goals: 2, assists: 1, matchesPlayed: 6, yellowCards: 2, redCards: 0, status: "Active" },
  { id: "PL-20", name: "Keiji Akaashi", age: 17, gender: "Male", position: "Midfielder", jerseyNumber: 5, teamId: "TM-06", goals: 1, assists: 1, matchesPlayed: 6, yellowCards: 1, redCards: 0, status: "Active" }
];

export const INITIAL_MATCHES: Match[] = [
  // Round 1
  {
    id: "MT-01",
    homeTeamId: "TM-01",
    awayTeamId: "TM-02",
    venueId: "VN-01",
    refereeId: "RF-01",
    date: "2026-10-05",
    time: "18:00",
    status: "Completed",
    homeScore: 3,
    awayScore: 1,
    winnerId: "TM-01"
  },
  {
    id: "MT-02",
    homeTeamId: "TM-03",
    awayTeamId: "TM-04",
    venueId: "VN-03",
    refereeId: "RF-02",
    date: "2026-10-06",
    time: "19:30",
    status: "Completed",
    homeScore: 2,
    awayScore: 2,
    winnerId: "DRAW"
  },
  {
    id: "MT-03",
    homeTeamId: "TM-05",
    awayTeamId: "TM-06",
    venueId: "VN-02",
    refereeId: "RF-03",
    date: "2026-10-07",
    time: "17:00",
    status: "Completed",
    homeScore: 1,
    awayScore: 0,
    winnerId: "TM-05"
  },

  // Round 2
  {
    id: "MT-04",
    homeTeamId: "TM-01",
    awayTeamId: "TM-03",
    venueId: "VN-01",
    refereeId: "RF-02",
    date: "2026-10-12",
    time: "18:30",
    status: "Completed",
    homeScore: 2,
    awayScore: 1,
    winnerId: "TM-01"
  },
  {
    id: "MT-05",
    homeTeamId: "TM-02",
    awayTeamId: "TM-05",
    venueId: "VN-02",
    refereeId: "RF-01",
    date: "2026-10-13",
    time: "20:00",
    status: "Completed",
    homeScore: 3,
    awayScore: 0,
    winnerId: "TM-02"
  },
  {
    id: "MT-06",
    homeTeamId: "TM-04",
    awayTeamId: "TM-06",
    venueId: "VN-04",
    refereeId: "RF-04",
    date: "2026-10-14",
    time: "16:00",
    status: "Completed",
    homeScore: 2,
    awayScore: 1,
    winnerId: "TM-04"
  },

  // Round 3
  {
    id: "MT-07",
    homeTeamId: "TM-01",
    awayTeamId: "TM-04",
    venueId: "VN-01",
    refereeId: "RF-03",
    date: "2026-10-19",
    time: "19:00",
    status: "Completed",
    homeScore: 4,
    awayScore: 1,
    winnerId: "TM-01"
  },
  {
    id: "MT-08",
    homeTeamId: "TM-02",
    awayTeamId: "TM-03",
    venueId: "VN-02",
    refereeId: "RF-04",
    date: "2026-10-20",
    time: "18:00",
    status: "Completed",
    homeScore: 1,
    awayScore: 1,
    winnerId: "DRAW"
  },
  {
    id: "MT-09",
    homeTeamId: "TM-06",
    awayTeamId: "TM-05",
    venueId: "VN-03",
    refereeId: "RF-01",
    date: "2026-10-21",
    time: "17:30",
    status: "Completed",
    homeScore: 1,
    awayScore: 1,
    winnerId: "DRAW"
  },

  // Round 4
  {
    id: "MT-10",
    homeTeamId: "TM-02",
    awayTeamId: "TM-04",
    venueId: "VN-02",
    refereeId: "RF-02",
    date: "2026-10-26",
    time: "19:00",
    status: "Completed",
    homeScore: 2,
    awayScore: 0,
    winnerId: "TM-02"
  },
  {
    id: "MT-11",
    homeTeamId: "TM-03",
    awayTeamId: "TM-05",
    venueId: "VN-03",
    refereeId: "RF-03",
    date: "2026-10-27",
    time: "18:00",
    status: "Completed",
    homeScore: 3,
    awayScore: 1,
    winnerId: "TM-03"
  },
  {
    id: "MT-12",
    homeTeamId: "TM-06",
    awayTeamId: "TM-01",
    venueId: "VN-04",
    refereeId: "RF-01",
    date: "2026-10-28",
    time: "20:00",
    status: "Completed",
    homeScore: 0,
    awayScore: 3,
    winnerId: "TM-01"
  },

  // Round 5
  {
    id: "MT-13",
    homeTeamId: "TM-05",
    awayTeamId: "TM-01",
    venueId: "VN-02",
    refereeId: "RF-04",
    date: "2026-11-01",
    time: "18:00",
    status: "Completed",
    homeScore: 2,
    awayScore: 2,
    winnerId: "DRAW"
  },
  {
    id: "MT-14",
    homeTeamId: "TM-04",
    awayTeamId: "TM-02",
    venueId: "VN-04",
    refereeId: "RF-03",
    date: "2026-11-01",
    time: "20:00",
    status: "Completed",
    homeScore: 1,
    awayScore: 2,
    winnerId: "TM-02"
  },
  {
    id: "MT-15",
    homeTeamId: "TM-03",
    awayTeamId: "TM-06",
    venueId: "VN-03",
    refereeId: "RF-02",
    date: "2026-11-02",
    time: "17:00",
    status: "Completed",
    homeScore: 2,
    awayScore: 1,
    winnerId: "TM-03"
  },

  // Upcoming Matches
  {
    id: "MT-16",
    homeTeamId: "TM-01",
    awayTeamId: "TM-02",
    venueId: "VN-01",
    refereeId: "RF-01",
    date: "2026-11-08",
    time: "18:00",
    status: "Scheduled",
    homeScore: 0,
    awayScore: 0
  },
  {
    id: "MT-17",
    homeTeamId: "TM-03",
    awayTeamId: "TM-04",
    venueId: "VN-03",
    refereeId: "RF-02",
    date: "2026-11-09",
    time: "19:30",
    status: "Scheduled",
    homeScore: 0,
    awayScore: 0
  },
  {
    id: "MT-18",
    homeTeamId: "TM-05",
    awayTeamId: "TM-06",
    venueId: "VN-02",
    refereeId: "RF-03",
    date: "2026-11-10",
    time: "17:00",
    status: "Scheduled",
    homeScore: 0,
    awayScore: 0
  }
];

export const INITIAL_ACTIVITIES: ActivityLog[] = [
  {
    id: "ACT-01",
    actionType: "MATCH_SCORE",
    title: "Blue Lock FC defeat Fukurodani Owls 2 - 1",
    description: "Yoichi Isagi scores a decisive goal in the 88th minute at Sakura Arena.",
    timestamp: "2026-11-02 19:15"
  },
  {
    id: "ACT-02",
    actionType: "MATCH_SCHEDULED",
    title: "Championship Round Matches Scheduled",
    description: "Fixtures MT-16 through MT-18 slated for November 8-10 across Tokyo National Stadium and Sakura Arena.",
    timestamp: "2026-11-02 14:00"
  },
  {
    id: "ACT-03",
    actionType: "MATCH_SCORE",
    title: "Nekoma Cats triumph over Seirin Falcons 2 - 1",
    description: "Kenma Kozume coordinates tactical counter-play to keep Nekoma Cats in title hunt.",
    timestamp: "2026-11-01 22:05"
  },
  {
    id: "ACT-04",
    actionType: "PLAYER_ADDED",
    title: "New Player Registered",
    description: "Forward Ryunosuke Tanaka (Jersey #5) added to Karasuno Crows roster.",
    timestamp: "2026-10-30 11:30"
  }
];
