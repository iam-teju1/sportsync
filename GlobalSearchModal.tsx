import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, User, Calendar, MapPin, Award, ChevronRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { SearchService, SearchResultItem } from '../../services/searchService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, entityId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { teams, players, matches, venues, referees } = useTournament();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = SearchService.searchAll(query, teams, players, matches, venues, referees);
    setResults(res);
  }, [query, teams, players, matches, venues, referees]);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getEntityIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'team':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'player':
        return <User className="w-5 h-5 text-cyan-400" />;
      case 'match':
        return <Calendar className="w-5 h-5 text-amber-400" />;
      case 'venue':
        return <MapPin className="w-5 h-5 text-purple-400" />;
      case 'referee':
        return <Award className="w-5 h-5 text-rose-400" />;
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    let tab = 'dashboard';
    if (item.type === 'team') tab = 'teams';
    else if (item.type === 'player') tab = 'players';
    else if (item.type === 'match') tab = 'matches';
    else if (item.type === 'venue') tab = 'venues';
    else if (item.type === 'referee') tab = 'referees';

    onNavigate(tab, item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/60">
          <Search className="w-5 h-5 text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search teams, players, matches, venues, referees, coaches, cities, dates..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-md mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 divide-y divide-slate-800/40">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-400">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-medium text-slate-300">Quick Global Search</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Type keywords like "Tokyo", "Hinata", "Karasuno", "Sakura Arena", or "Completed" to find anything across the tournament.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm font-medium text-slate-300">No matching tournament records found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for a different player name, team, venue city, or match ID.
              </p>
            </div>
          ) : (
            results.map(item => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/60 group-hover:border-emerald-500/40 transition-colors shrink-0">
                    {getEntityIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">{item.title}</span>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.details}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-3" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>{results.length} results found</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate • Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
