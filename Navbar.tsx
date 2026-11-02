import React, { useState } from 'react';
import {
  Trophy,
  Search,
  Moon,
  Sun,
  Shield,
  ShieldAlert,
  Database,
  Menu,
  X,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenSupabase: () => void;
  onOpenConfirmation: (title: string, msg: string, onConfirm: () => void) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenSupabase,
  onOpenConfirmation,
  mobileMenuOpen,
  setMobileMenuOpen
}) => {
  const { theme, toggleTheme, userRole, setUserRole, isSupabaseConnected, resetToDemoData } = useTournament();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleRoleToggle = () => {
    setUserRole(userRole === 'ADMIN' ? 'VIEWER' : 'ADMIN');
  };

  const handleReset = () => {
    onOpenConfirmation(
      'Reset Tournament Data',
      'This will reset all teams, players, fixtures, and standings back to the official demo tournament state. Are you sure?',
      () => resetToDemoData()
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/85 dark:bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Trophy className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white font-display">
                  Sport<span className="text-emerald-400">Sync</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                Tournament Organizer
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs transition-all shadow-inner group"
          >
            <span className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Search teams, players, matches, venues...</span>
            </span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-700/80 rounded-md">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right Actions & Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabase}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSupabaseConnected
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-emerald-500/50'
            }`}
            title="Database Configuration"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline">
              {isSupabaseConnected ? 'Supabase Live' : 'Supabase DB'}
            </span>
          </button>

          {/* Role Badge & Switcher */}
          <div className="relative">
            <button
              onClick={handleRoleToggle}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                userRole === 'ADMIN'
                  ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30'
                  : 'bg-amber-600/20 text-amber-400 border-amber-500/40 hover:bg-amber-600/30'
              }`}
              title={`Current Role: ${userRole}. Click to toggle Admin/Viewer mode.`}
            >
              {userRole === 'ADMIN' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ADMIN</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIEWER</span>
                </>
              )}
            </button>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
            title="Reset Tournament to Demo Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition-colors"
            title="Toggle Light / Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
