import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Team, Player, Venue, Referee, Match, ActivityLog } from '../types';
import {
  INITIAL_TEAMS,
  INITIAL_PLAYERS,
  INITIAL_VENUES,
  INITIAL_REFEREES,
  INITIAL_MATCHES,
  INITIAL_ACTIVITIES
} from '../data/initialData';

// IndexedDB Helper for robust permanent browser storage fallback
const DB_NAME = 'SportSync_Permanent_DB';
const DB_VERSION = 1;

class IndexedDBAdapter {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('app_data')) {
          db.createObjectStore('app_data');
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('app_data', 'readonly');
      const store = tx.objectStore('app_data');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('app_data', 'readwrite');
      const store = tx.objectStore('app_data');
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear(): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('app_data', 'readwrite');
      const store = tx.objectStore('app_data');
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

const idb = new IndexedDBAdapter();

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface AppStateData {
  teams: Team[];
  players: Player[];
  venues: Venue[];
  referees: Referee[];
  matches: Match[];
  activities: ActivityLog[];
}

export class StorageService {
  private static instance: StorageService;
  private supabase: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || ''
  };

  private constructor() {
    this.initSupabase();
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private initSupabase() {
    // Check saved config in IDB if not in env
    if (this.config.url && this.config.anonKey) {
      try {
        this.supabase = createClient(this.config.url, this.config.anonKey);
      } catch (e) {
        console.warn('Failed to initialize Supabase client:', e);
        this.supabase = null;
      }
    }
  }

  public async setSupabaseConfig(url: string, anonKey: string): Promise<boolean> {
    this.config = { url, anonKey };
    await idb.set('supabase_config', this.config);
    try {
      this.supabase = createClient(url, anonKey);
      // Quick test ping
      const { error } = await this.supabase.from('teams').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  public async getSupabaseConfig(): Promise<SupabaseConfig> {
    const saved = await idb.get<SupabaseConfig>('supabase_config');
    if (saved && saved.url && saved.anonKey) {
      this.config = saved;
      this.initSupabase();
    }
    return this.config;
  }

  public isSupabaseConnected(): boolean {
    return Boolean(this.supabase && this.config.url && this.config.anonKey);
  }

  public async testConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
    try {
      const client = createClient(url, key);
      const { error } = await client.from('teams').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          return { success: false, message: 'Connected to Supabase, but tables are missing. Please execute the provided schema SQL script in your Supabase SQL editor.' };
        }
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection failed' };
    }
  }

  // Load all tournament data
  public async loadAllData(): Promise<AppStateData> {
    await this.getSupabaseConfig();

    if (this.isSupabaseConnected() && this.supabase) {
      try {
        const [teamsRes, playersRes, venuesRes, refsRes, matchesRes, actsRes] = await Promise.all([
          this.supabase.from('teams').select('*'),
          this.supabase.from('players').select('*'),
          this.supabase.from('venues').select('*'),
          this.supabase.from('referees').select('*'),
          this.supabase.from('matches').select('*'),
          this.supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(30)
        ]);

        if (!teamsRes.error && teamsRes.data && teamsRes.data.length > 0) {
          return {
            teams: teamsRes.data.map((t: any) => ({
              id: t.id,
              name: t.name,
              coach: t.coach,
              captain: t.captain,
              city: t.city,
              logo: t.logo || '',
              description: t.description || '',
              registeredDate: t.registered_date || t.created_at,
              wins: t.wins ?? 0,
              draws: t.draws ?? 0,
              losses: t.losses ?? 0,
              goalsFor: t.goals_for ?? 0,
              goalsAgainst: t.goals_against ?? 0,
              points: t.points ?? 0,
            })),
            players: (playersRes.data || []).map((p: any) => ({
              id: p.id,
              name: p.name,
              age: p.age,
              gender: p.gender,
              position: p.position,
              jerseyNumber: p.jersey_number,
              teamId: p.team_id,
              goals: p.goals ?? 0,
              assists: p.assists ?? 0,
              matchesPlayed: p.matches_played ?? 0,
              yellowCards: p.yellow_cards ?? 0,
              redCards: p.red_cards ?? 0,
              status: p.status,
            })),
            venues: (venuesRes.data || []).map((v: any) => ({
              id: v.id,
              name: v.name,
              address: v.address,
              city: v.city,
              capacity: v.capacity,
              availability: v.availability,
            })),
            referees: (refsRes.data || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              experience: r.experience,
              phone: r.phone,
              email: r.email,
              assignedMatches: r.assigned_matches ?? 0,
              status: r.status,
            })),
            matches: (matchesRes.data || []).map((m: any) => ({
              id: m.id,
              homeTeamId: m.home_team_id,
              awayTeamId: m.away_team_id,
              venueId: m.venue_id,
              refereeId: m.referee_id,
              date: m.match_date,
              time: m.match_time,
              status: m.status,
              homeScore: m.home_score ?? 0,
              awayScore: m.away_score ?? 0,
              winnerId: m.winner_team_id,
            })),
            activities: (actsRes.data || []).map((a: any) => ({
              id: a.id,
              actionType: a.action_type,
              title: a.title,
              description: a.description,
              timestamp: a.created_at,
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to permanent IndexedDB:', err);
      }
    }

    // Fallback to permanent IndexedDB
    const stored = await idb.get<AppStateData>('tournament_state');
    if (stored && stored.teams && stored.teams.length > 0) {
      // If stored data has legacy Western names, auto-upgrade to anime tournament dataset
      if (stored.teams.some(t => t.name === 'Thunder Strikers FC')) {
        const upgradedData: AppStateData = {
          teams: INITIAL_TEAMS,
          players: INITIAL_PLAYERS,
          venues: INITIAL_VENUES,
          referees: INITIAL_REFEREES,
          matches: INITIAL_MATCHES,
          activities: INITIAL_ACTIVITIES
        };
        await idb.set('tournament_state', upgradedData);
        return upgradedData;
      }
      return stored;
    }

    // Default Seed Data permanently stored
    const initialData: AppStateData = {
      teams: INITIAL_TEAMS,
      players: INITIAL_PLAYERS,
      venues: INITIAL_VENUES,
      referees: INITIAL_REFEREES,
      matches: INITIAL_MATCHES,
      activities: INITIAL_ACTIVITIES
    };

    await idb.set('tournament_state', initialData);
    return initialData;
  }

  // Save all tournament data permanently
  public async saveAllData(data: AppStateData): Promise<void> {
    // Always persist to local IndexedDB for instant UI responsiveness and offline resilience
    await idb.set('tournament_state', data);

    // If Supabase is connected, sync to remote PostgreSQL
    if (this.isSupabaseConnected() && this.supabase) {
      try {
        // Upsert teams
        const teamsPayload = data.teams.map(t => ({
          id: t.id,
          name: t.name,
          coach: t.coach,
          captain: t.captain,
          city: t.city,
          logo: t.logo,
          description: t.description,
          registered_date: t.registeredDate,
          wins: t.wins,
          draws: t.draws,
          losses: t.losses,
          goals_for: t.goalsFor,
          goals_against: t.goalsAgainst,
          points: t.points,
          updated_at: new Date().toISOString()
        }));
        await this.supabase.from('teams').upsert(teamsPayload);

        // Upsert venues
        const venuesPayload = data.venues.map(v => ({
          id: v.id,
          name: v.name,
          address: v.address,
          city: v.city,
          capacity: v.capacity,
          availability: v.availability,
          updated_at: new Date().toISOString()
        }));
        await this.supabase.from('venues').upsert(venuesPayload);

        // Upsert referees
        const refsPayload = data.referees.map(r => ({
          id: r.id,
          name: r.name,
          experience: r.experience,
          phone: r.phone,
          email: r.email,
          assigned_matches: r.assignedMatches,
          status: r.status,
          updated_at: new Date().toISOString()
        }));
        await this.supabase.from('referees').upsert(refsPayload);

        // Upsert players
        const playersPayload = data.players.map(p => ({
          id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          position: p.position,
          jersey_number: p.jerseyNumber,
          team_id: p.teamId,
          goals: p.goals,
          assists: p.assists,
          matches_played: p.matchesPlayed,
          yellow_cards: p.yellowCards,
          red_cards: p.redCards,
          status: p.status,
          updated_at: new Date().toISOString()
        }));
        await this.supabase.from('players').upsert(playersPayload);

        // Upsert matches
        const matchesPayload = data.matches.map(m => ({
          id: m.id,
          home_team_id: m.homeTeamId,
          away_team_id: m.awayTeamId,
          venue_id: m.venueId,
          referee_id: m.refereeId,
          match_date: m.date,
          match_time: m.time,
          status: m.status,
          home_score: m.homeScore,
          away_score: m.awayScore,
          winner_team_id: m.winnerId === 'DRAW' ? null : m.winnerId,
          updated_at: new Date().toISOString()
        }));
        await this.supabase.from('matches').upsert(matchesPayload);
      } catch (err) {
        console.error('Remote Supabase sync error:', err);
      }
    }
  }

  // Reset to initial demo tournament data
  public async resetToDefaults(): Promise<AppStateData> {
    const defaultData: AppStateData = {
      teams: INITIAL_TEAMS,
      players: INITIAL_PLAYERS,
      venues: INITIAL_VENUES,
      referees: INITIAL_REFEREES,
      matches: INITIAL_MATCHES,
      activities: INITIAL_ACTIVITIES
    };
    await idb.set('tournament_state', defaultData);
    return defaultData;
  }
}

export const storageService = StorageService.getInstance();
