import React from 'react';
import {
  BrainCircuit,
  Trophy,
  Award,
  Flame,
  Shield,
  TrendingUp,
  Activity,
  Zap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BarChart3
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { analytics, teams, standings } = useTournament();

  const PIE_COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

  const matchOutcomes = [
    { name: 'Decisive Wins', value: analytics.winPercentage, color: '#10b981' },
    { name: 'Draws', value: analytics.drawPercentage, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Predictive AI Engine Active
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-display mt-1.5">
              <BrainCircuit className="w-6 h-6 text-emerald-400" />
              Tournament Analytics & AI Insights
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Automated awards calculations, statistical distribution, venue capacity utilization, and AI match predictions.
            </p>
          </div>
        </div>
      </div>

      {/* Awards & Champions Podium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Champion */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Tournament Champion
            </span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {analytics.champion?.name || 'In Contention'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Points: <strong className="text-amber-300">{analytics.champion?.points || 0} PTS</strong> • GD: +{((analytics.champion?.goalsFor || 0) - (analytics.champion?.goalsAgainst || 0))}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Head Coach: {analytics.champion?.coach}
            </p>
          </div>
        </div>

        {/* 2. Runner Up */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-400/10 via-slate-900 to-slate-950 border border-slate-700 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Runner Up
            </span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {analytics.runnerUp?.name || 'In Contention'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Points: <strong className="text-slate-200">{analytics.runnerUp?.points || 0} PTS</strong> • Wins: {analytics.runnerUp?.wins || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Head Coach: {analytics.runnerUp?.coach}
            </p>
          </div>
        </div>

        {/* 3. Golden Boot (Top Scorer) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-500/15 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Golden Boot (Top Scorer)
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {analytics.topScorer ? analytics.topScorer.player.name : 'N/A'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Goals: <strong className="text-emerald-400">{analytics.topScorer?.player.goals || 0} Goals</strong> (#{analytics.topScorer?.player.jerseyNumber})
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {analytics.topScorer?.teamName}
            </p>
          </div>
        </div>

        {/* 4. Tournament MVP */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-500/15 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              Most Valuable Player (MVP)
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              {analytics.mvp ? analytics.mvp.player.name : 'N/A'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Impact Rating: <strong className="text-cyan-400">{analytics.mvp?.rating || 0}</strong> ({analytics.mvp?.player.goals}G, {analytics.mvp?.player.assists}A)
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {analytics.mvp?.teamName}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Best Attack</span>
          <p className="text-sm font-bold text-white mt-1 truncate">{analytics.bestAttack?.team.name || 'N/A'}</p>
          <span className="text-xs text-emerald-400 font-bold">{analytics.bestAttack?.goals || 0} Goals</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Best Defense</span>
          <p className="text-sm font-bold text-white mt-1 truncate">{analytics.bestDefense?.team.name || 'N/A'}</p>
          <span className="text-xs text-cyan-400 font-bold">{analytics.bestDefense?.goalsConceded || 0} Conceded</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Most Wins</span>
          <p className="text-sm font-bold text-white mt-1 truncate">{analytics.mostWins?.team.name || 'N/A'}</p>
          <span className="text-xs text-emerald-400 font-bold">{analytics.mostWins?.count || 0} Wins</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Most Losses</span>
          <p className="text-sm font-bold text-white mt-1 truncate">{analytics.mostLosses?.team.name || 'N/A'}</p>
          <span className="text-xs text-rose-400 font-bold">{analytics.mostLosses?.count || 0} Defeats</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Average Goals</span>
          <p className="text-base font-black text-amber-400 mt-1">{analytics.averageGoalsPerMatch}</p>
          <span className="text-[10px] text-slate-400">Goals / Fixture</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Highest Scoring</span>
          <p className="text-base font-black text-white mt-1">
            {analytics.highestScoringMatch?.totalGoals || 0} Goals
          </p>
          <span className="text-[10px] text-slate-400 truncate block">
            {analytics.highestScoringMatch ? `${analytics.highestScoringMatch.homeTeamName} vs ${analytics.highestScoringMatch.awayTeamName}` : 'N/A'}
          </span>
        </div>
      </div>

      {/* AI Tournament Insights Cards */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Automated AI Tournament Insights & Tactical Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Heuristic predictive models analyzing squad form, goal margins, and officiating fairness.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Real-Time Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analytics.aiInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-800 text-cyan-300">
                  {insight.category}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  {insight.confidenceScore}% Confidence
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{insight.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{insight.summary}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Venue Utilization */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-400" />
              Stadium Facility Utilization
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Number of tournament fixtures hosted per venue and overall usage share
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.venueUsage} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="venueName" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="matchCount" name="Matches Hosted" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Referee Officiating Distribution */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-400" />
              Referee Match Assignment Workload
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution of officiating appointments across certified referee corps
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.refereeAssignments} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="assignedMatches" name="Assigned Matches" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
