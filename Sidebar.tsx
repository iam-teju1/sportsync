import React from 'react';
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Users,
  UserCheck,
  MapPin,
  Award,
  FileSpreadsheet,
  BrainCircuit,
  Database
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenSupabase: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenSupabase
}) => {
  const { matches, teams, players } = useTournament();

  const upcomingCount = matches.filter(m => m.status === 'Scheduled').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'standings', label: 'Points Table', icon: Trophy },
    { id: 'matches', label: 'Matches & Fixtures', icon: Calendar, badge: upcomingCount > 0 ? upcomingCount : undefined },
    { id: 'teams', label: 'Teams', icon: Users, badge: teams.length },
    { id: 'players', label: 'Players', icon: UserCheck, badge: players.length },
    { id: 'venues', label: 'Venues', icon: MapPin },
    { id: 'referees', label: 'Referees', icon: Award },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
    { id: 'analytics', label: 'AI Analytics', icon: BrainCircuit, isNew: true },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Tournament Management
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform ${
                        isActive
                          ? 'text-white scale-110'
                          : 'text-slate-400 group-hover:text-emerald-400 group-hover:scale-110'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.isNew && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      AI
                    </span>
                  )}

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database Quick Access card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-bold text-white mb-1">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase Cloud DB</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug mb-3">
            Permanent relational PostgreSQL storage enabled.
          </p>
          <button
            onClick={() => {
              onOpenSupabase();
              setMobileMenuOpen(false);
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold text-center transition-colors"
          >
            Manage Supabase
          </button>
        </div>
      </aside>
    </>
  );
};
