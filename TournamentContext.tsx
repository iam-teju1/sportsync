import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Team,
  Player,
  Venue,
  Referee,
  Match,
  ActivityLog,
  StandingsRow,
  UserRole,
  ToastMessage
} from '../types';
import { storageService, AppStateData } from '../services/storageService';
import { AnalyticsService, TournamentAnalytics } from '../services/analyticsService';
import { ValidateService } from '../services/validateService';
import confetti from 'canvas-confetti';

interface TournamentContextType {
  teams: Team[];
  players: Player[];
  venues: Venue[];
  referees: Referee[];
  matches: Match[];
  activities: ActivityLog[];
  standings: StandingsRow[];
  analytics: TournamentAnalytics;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;

  // Team Operations
  addTeam: (team: Omit<Team, 'wins' | 'draws' | 'losses' | 'goalsFor' | 'goalsAgainst' | 'points'>) => Promise<{ success: boolean; error?: string }>;
  updateTeam: (team: Team) => Promise<{ success: boolean; error?: string }>;
  deleteTeam: (id: string, force?: boolean) => Promise<{ success: boolean; error?: string; warning?: string }>;

  // Player Operations
  addPlayer: (player: Omit<Player, 'goals' | 'assists' | 'matchesPlayed' | 'yellowCards' | 'redCards'>) => Promise<{ success: boolean; error?: string }>;
  updatePlayer: (player: Player) => Promise<{ success: boolean; error?: string }>;
  deletePlayer: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Venue Operations
  addVenue: (venue: Venue) => Promise<{ success: boolean; error?: string }>;
  updateVenue: (venue: Venue) => Promise<{ success: boolean; error?: string }>;
  deleteVenue: (id: string) => Promise<{ success: boolean; error?: string; warning?: string }>;

  // Referee Operations
  addReferee: (referee: Omit<Referee, 'assignedMatches'>) => Promise<{ success: boolean; error?: string }>;
  updateReferee: (referee: Referee) => Promise<{ success: boolean; error?: string }>;
  deleteReferee: (id: string) => Promise<{ success: boolean; error?: string; warning?: string }>;

  // Match Operations
  scheduleMatch: (match: Omit<Match, 'homeScore' | 'awayScore' | 'winnerId'>) => Promise<{ success: boolean; error?: string }>;
  updateMatch: (match: Match) => Promise<{ success: boolean; error?: string }>;
  recordScore: (matchId: string, homeScore: number, awayScore: number) => Promise<{ success: boolean; error?: string }>;
  cancelMatch: (matchId: string) => Promise<{ success: boolean; error?: string }>;
  deleteMatch: (matchId: string) => Promise<{ success: boolean; error?: string }>;

  // Storage and Sync
  isSupabaseConnected: boolean;
  refreshData: () => Promise<void>;
  resetToDemoData: () => Promise<void>;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = useCallback((type: ToastMessage['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message, duration: 4000 }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Theme Initializer
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Helper to persist current state
  const persistState = useCallback(async (
    newTeams: Team[],
    newPlayers: Player[],
    newVenues: Venue[],
    newReferees: Referee[],
    newMatches: Match[],
    newActivities: ActivityLog[]
  ) => {
    const data: AppStateData = {
      teams: newTeams,
      players: newPlayers,
      venues: newVenues,
      referees: newReferees,
      matches: newMatches,
      activities: newActivities
    };
    await storageService.saveAllData(data);
  }, []);

  // Load initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await storageService.loadAllData();
      setTeams(data.teams);
      setPlayers(data.players);
      setVenues(data.venues);
      setReferees(data.referees);
      setMatches(data.matches);
      setActivities(data.activities);
    } catch (err) {
      console.error('Error loading tournament data:', err);
      addToast('error', 'Data Load Error', 'Could not load data from storage.');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Standings & Analytics
  const standings = useMemo(() => {
    return AnalyticsService.calculateStandings(teams, matches);
  }, [teams, matches]);

  const analytics = useMemo(() => {
    return AnalyticsService.computeAnalytics(teams, players, matches, venues, referees);
  }, [teams, players, matches, venues, referees]);

  // Add Activity Log helper
  const logActivity = (
    actionType: ActivityLog['actionType'],
    title: string,
    description: string,
    currentActs: ActivityLog[]
  ) => {
    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      actionType,
      title,
      description,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    return [newLog, ...currentActs.slice(0, 29)];
  };

  // ==========================================
  // TEAM ACTIONS
  // ==========================================
  const addTeam = async (
    teamData: Omit<Team, 'wins' | 'draws' | 'losses' | 'goalsFor' | 'goalsAgainst' | 'points'>
  ) => {
    const validation = ValidateService.validateTeam(teamData, teams, false);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const newTeam: Team = {
      ...teamData,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0
    };

    const nextTeams = [...teams, newTeam];
    const nextActs = logActivity(
      'TEAM_ADDED',
      `New Team Registered: ${newTeam.name}`,
      `Managed by ${newTeam.coach} from ${newTeam.city}.`,
      activities
    );

    setTeams(nextTeams);
    setActivities(nextActs);
    await persistState(nextTeams, players, venues, referees, matches, nextActs);
    addToast('success', 'Team Added', `${newTeam.name} successfully registered.`);
    return { success: true };
  };

  const updateTeam = async (teamData: Team) => {
    const validation = ValidateService.validateTeam(teamData, teams, true);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextTeams = teams.map(t => (t.id === teamData.id ? teamData : t));
    setTeams(nextTeams);
    await persistState(nextTeams, players, venues, referees, matches, activities);
    addToast('success', 'Team Updated', `${teamData.name} profile updated.`);
    return { success: true };
  };

  const deleteTeam = async (id: string, force = false) => {
    const target = teams.find(t => t.id === id);
    if (!target) return { success: false, error: 'Team not found' };

    // Check linked players and matches
    const linkedPlayers = players.filter(p => p.teamId === id);
    const linkedMatches = matches.filter(m => m.homeTeamId === id || m.awayTeamId === id);

    if (!force && (linkedPlayers.length > 0 || linkedMatches.length > 0)) {
      return {
        success: false,
        warning: `This team has ${linkedPlayers.length} player(s) and ${linkedMatches.length} match(es) associated with it. Are you sure you want to proceed? Linked players will be unassigned.`
      };
    }

    const nextTeams = teams.filter(t => t.id !== id);
    const nextPlayers = players.map(p => (p.teamId === id ? { ...p, teamId: '' } : p));
    const nextMatches = matches.filter(m => m.homeTeamId !== id && m.awayTeamId !== id);

    setTeams(nextTeams);
    setPlayers(nextPlayers);
    setMatches(nextMatches);
    await persistState(nextTeams, nextPlayers, venues, referees, nextMatches, activities);
    addToast('warning', 'Team Removed', `${target.name} has been removed.`);
    return { success: true };
  };

  // ==========================================
  // PLAYER ACTIONS
  // ==========================================
  const addPlayer = async (
    playerData: Omit<Player, 'goals' | 'assists' | 'matchesPlayed' | 'yellowCards' | 'redCards'>
  ) => {
    const validation = ValidateService.validatePlayer(playerData, players, teams, false);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const newPlayer: Player = {
      ...playerData,
      goals: 0,
      assists: 0,
      matchesPlayed: 0,
      yellowCards: 0,
      redCards: 0
    };

    const nextPlayers = [...players, newPlayer];
    const teamObj = teams.find(t => t.id === newPlayer.teamId);
    const nextActs = logActivity(
      'PLAYER_ADDED',
      `Player Added: ${newPlayer.name}`,
      `Joined ${teamObj?.name || 'team'} wearing #${newPlayer.jerseyNumber}.`,
      activities
    );

    setPlayers(nextPlayers);
    setActivities(nextActs);
    await persistState(teams, nextPlayers, venues, referees, matches, nextActs);
    addToast('success', 'Player Added', `${newPlayer.name} registered.`);
    return { success: true };
  };

  const updatePlayer = async (playerData: Player) => {
    const validation = ValidateService.validatePlayer(playerData, players, teams, true);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextPlayers = players.map(p => (p.id === playerData.id ? playerData : p));
    setPlayers(nextPlayers);
    await persistState(teams, nextPlayers, venues, referees, matches, activities);
    addToast('success', 'Player Updated', `${playerData.name} profile updated.`);
    return { success: true };
  };

  const deletePlayer = async (id: string) => {
    const target = players.find(p => p.id === id);
    if (!target) return { success: false, error: 'Player not found' };

    const nextPlayers = players.filter(p => p.id !== id);
    setPlayers(nextPlayers);
    await persistState(teams, nextPlayers, venues, referees, matches, activities);
    addToast('info', 'Player Removed', `${target.name} removed from roster.`);
    return { success: true };
  };

  // ==========================================
  // VENUE ACTIONS
  // ==========================================
  const addVenue = async (venueData: Venue) => {
    const validation = ValidateService.validateVenue(venueData, venues, false);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextVenues = [...venues, venueData];
    setVenues(nextVenues);
    await persistState(teams, players, nextVenues, referees, matches, activities);
    addToast('success', 'Venue Added', `${venueData.name} registered.`);
    return { success: true };
  };

  const updateVenue = async (venueData: Venue) => {
    const validation = ValidateService.validateVenue(venueData, venues, true);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextVenues = venues.map(v => (v.id === venueData.id ? venueData : v));
    setVenues(nextVenues);
    await persistState(teams, players, nextVenues, referees, matches, activities);
    addToast('success', 'Venue Updated', `${venueData.name} updated.`);
    return { success: true };
  };

  const deleteVenue = async (id: string) => {
    const hasMatches = matches.some(m => m.venueId === id && m.status !== 'Completed');
    if (hasMatches) {
      return { success: false, warning: 'This venue has active scheduled matches. Reassign matches before deleting.' };
    }

    const nextVenues = venues.filter(v => v.id !== id);
    setVenues(nextVenues);
    await persistState(teams, players, nextVenues, referees, matches, activities);
    addToast('info', 'Venue Removed', 'Venue deleted.');
    return { success: true };
  };

  // ==========================================
  // REFEREE ACTIONS
  // ==========================================
  const addReferee = async (refData: Omit<Referee, 'assignedMatches'>) => {
    const fullRef: Referee = { ...refData, assignedMatches: 0 };
    const validation = ValidateService.validateReferee(fullRef, referees, false);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextRefs = [...referees, fullRef];
    setReferees(nextRefs);
    await persistState(teams, players, venues, nextRefs, matches, activities);
    addToast('success', 'Referee Added', `${fullRef.name} added to officiating panel.`);
    return { success: true };
  };

  const updateReferee = async (refData: Referee) => {
    const validation = ValidateService.validateReferee(refData, referees, true);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextRefs = referees.map(r => (r.id === refData.id ? refData : r));
    setReferees(nextRefs);
    await persistState(teams, players, venues, nextRefs, matches, activities);
    addToast('success', 'Referee Updated', `${refData.name} updated.`);
    return { success: true };
  };

  const deleteReferee = async (id: string) => {
    const hasMatches = matches.some(m => m.refereeId === id && m.status !== 'Completed');
    if (hasMatches) {
      return { success: false, warning: 'This referee is assigned to upcoming matches. Reassign officials first.' };
    }

    const nextRefs = referees.filter(r => r.id !== id);
    setReferees(nextRefs);
    await persistState(teams, players, venues, nextRefs, matches, activities);
    addToast('info', 'Referee Removed', 'Referee record removed.');
    return { success: true };
  };

  // ==========================================
  // MATCH ACTIONS
  // ==========================================
  const scheduleMatch = async (matchData: Omit<Match, 'homeScore' | 'awayScore' | 'winnerId'>) => {
    const fullMatch: Match = {
      ...matchData,
      homeScore: 0,
      awayScore: 0
    };

    const validation = ValidateService.validateMatch(fullMatch, matches, venues, referees, false);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Scheduling Conflict', firstError);
      return { success: false, error: firstError };
    }

    const nextMatches = [...matches, fullMatch];
    const homeName = teams.find(t => t.id === fullMatch.homeTeamId)?.name || 'Home';
    const awayName = teams.find(t => t.id === fullMatch.awayTeamId)?.name || 'Away';

    const nextActs = logActivity(
      'MATCH_SCHEDULED',
      `Match Scheduled: ${homeName} vs ${awayName}`,
      `Slated for ${fullMatch.date} at ${fullMatch.time}. Match ID: ${fullMatch.id}`,
      activities
    );

    // Update referee assigned match count
    const nextRefs = referees.map(r =>
      r.id === fullMatch.refereeId ? { ...r, assignedMatches: r.assignedMatches + 1 } : r
    );

    setMatches(nextMatches);
    setReferees(nextRefs);
    setActivities(nextActs);
    await persistState(teams, players, venues, nextRefs, nextMatches, nextActs);
    addToast('success', 'Match Scheduled', `${homeName} vs ${awayName} scheduled.`);
    return { success: true };
  };

  const updateMatch = async (matchData: Match) => {
    const validation = ValidateService.validateMatch(matchData, matches, venues, referees, true);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      addToast('error', 'Validation Error', firstError);
      return { success: false, error: firstError };
    }

    const nextMatches = matches.map(m => (m.id === matchData.id ? matchData : m));
    setMatches(nextMatches);
    await persistState(teams, players, venues, referees, nextMatches, activities);
    addToast('success', 'Match Updated', `Match ${matchData.id} updated.`);
    return { success: true };
  };

  const recordScore = async (matchId: string, homeScore: number, awayScore: number) => {
    const scoreVal = ValidateService.validateScore(homeScore, awayScore);
    if (!scoreVal.isValid) {
      const firstError = Object.values(scoreVal.errors)[0];
      addToast('error', 'Invalid Score', firstError);
      return { success: false, error: firstError };
    }

    const targetMatch = matches.find(m => m.id === matchId);
    if (!targetMatch) {
      return { success: false, error: 'Match not found' };
    }

    let winnerId: string | 'DRAW' | undefined;
    if (homeScore > awayScore) {
      winnerId = targetMatch.homeTeamId;
    } else if (awayScore > homeScore) {
      winnerId = targetMatch.awayTeamId;
    } else {
      winnerId = 'DRAW';
    }

    const updatedMatch: Match = {
      ...targetMatch,
      homeScore,
      awayScore,
      status: 'Completed',
      winnerId
    };

    const nextMatches = matches.map(m => (m.id === matchId ? updatedMatch : m));

    // Update Teams' wins, draws, losses, goals, and points
    // Recompute standings & team records from scratch based on all completed matches
    const newStandings = AnalyticsService.calculateStandings(teams, nextMatches);
    const nextTeams = teams.map(t => {
      const row = newStandings.find(s => s.teamId === t.id);
      if (!row) return t;
      return {
        ...t,
        wins: row.won,
        draws: row.drawn,
        losses: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points
      };
    });

    const homeTeam = teams.find(t => t.id === targetMatch.homeTeamId)?.name || 'Home';
    const awayTeam = teams.find(t => t.id === targetMatch.awayTeamId)?.name || 'Away';

    const nextActs = logActivity(
      'MATCH_SCORE',
      `Match Completed: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
      `Final score recorded for Match ${matchId}. Standings automatically updated.`,
      activities
    );

    setMatches(nextMatches);
    setTeams(nextTeams);
    setActivities(nextActs);

    await persistState(nextTeams, players, venues, referees, nextMatches, nextActs);

    // Trigger celebration confetti on match completion
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}

    addToast('success', 'Score Recorded', `Match ${matchId} concluded. Standings updated.`);
    return { success: true };
  };

  const cancelMatch = async (matchId: string) => {
    const nextMatches = matches.map(m =>
      m.id === matchId ? { ...m, status: 'Cancelled' as const } : m
    );
    setMatches(nextMatches);
    await persistState(teams, players, venues, referees, nextMatches, activities);
    addToast('warning', 'Match Cancelled', `Match ${matchId} has been cancelled.`);
    return { success: true };
  };

  const deleteMatch = async (matchId: string) => {
    const nextMatches = matches.filter(m => m.id !== matchId);
    setMatches(nextMatches);
    await persistState(teams, players, venues, referees, nextMatches, activities);
    addToast('info', 'Match Deleted', `Match ${matchId} deleted.`);
    return { success: true };
  };

  const resetToDemoData = async () => {
    setIsLoading(true);
    const data = await storageService.resetToDefaults();
    setTeams(data.teams);
    setPlayers(data.players);
    setVenues(data.venues);
    setReferees(data.referees);
    setMatches(data.matches);
    setActivities(data.activities);
    setIsLoading(false);
    addToast('success', 'Data Reset', 'Tournament reset to official demo state.');
  };

  return (
    <TournamentContext.Provider
      value={{
        teams,
        players,
        venues,
        referees,
        matches,
        activities,
        standings,
        analytics,
        userRole,
        setUserRole,
        theme,
        toggleTheme,
        isLoading,
        toasts,
        addToast,
        removeToast,
        addTeam,
        updateTeam,
        deleteTeam,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addVenue,
        updateVenue,
        deleteVenue,
        addReferee,
        updateReferee,
        deleteReferee,
        scheduleMatch,
        updateMatch,
        recordScore,
        cancelMatch,
        deleteMatch,
        isSupabaseConnected: storageService.isSupabaseConnected(),
        refreshData: loadData,
        resetToDemoData
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
