import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Team, Player, Match, Venue, Referee } from '../types';
import { AnalyticsService } from './analyticsService';

export type ReportType =
  | 'POINTS_TABLE'
  | 'FIXTURES'
  | 'MATCH_RESULTS'
  | 'PLAYERS'
  | 'TEAMS'
  | 'VENUES'
  | 'REFEREES'
  | 'TOURNAMENT_SUMMARY';

export interface ReportData {
  title: string;
  subtitle: string;
  headers: string[];
  rows: (string | number)[][];
}

export class ReportService {
  /**
   * Helper to format CSV row
   */
  private static escapeCSV(val: any): string {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Export to CSV file
   */
  public static exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
    const csvContent = [
      headers.map(this.escapeCSV).join(','),
      ...rows.map(row => row.map(this.escapeCSV).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export to Branded PDF using jsPDF
   */
  public static exportToPDF(
    title: string,
    subtitle: string,
    headers: string[],
    rows: (string | number)[][],
    filename: string
  ): void {
    const doc = new jsPDF({
      orientation: rows[0] && rows[0].length > 7 ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const primaryColor: [number, number, number] = [16, 185, 129]; // #10b981
    const darkSlate: [number, number, number] = [15, 23, 42]; // #0f172a

    // Header Banner
    doc.setFillColor(...darkSlate);
    doc.rect(0, 0, doc.internal.pageSize.width, 70, 'F');

    // Brand Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...primaryColor);
    doc.text('SPORTSYNC', 40, 36);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(203, 213, 225); // Slate 300
    doc.text('AI Sports Tournament Organizer • Official Report', 40, 52);

    // Timestamp
    const dateStr = new Date().toLocaleString();
    doc.setFontSize(9);
    doc.text(`Generated: ${dateStr}`, doc.internal.pageSize.width - 40, 52, { align: 'right' });

    // Document Title & Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...darkSlate);
    doc.text(title, 40, 105);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(subtitle, 40, 122);

    // AutoTable
    autoTable(doc, {
      startY: 135,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left'
      },
      bodyStyles: {
        textColor: [30, 41, 59],
        fontSize: 8.5,
        cellPadding: 6
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 40, right: 40, bottom: 40 },
      didDrawPage: (data) => {
        // Footer page numbering
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `SportSync Tournament System — Page ${data.pageNumber}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 20,
          { align: 'center' }
        );
      }
    });

    doc.save(`${filename}.pdf`);
  }

  // 1. Generate Points Table Report
  public static generatePointsTableReport(teams: Team[], matches: Match[]): ReportData {
    const standings = AnalyticsService.calculateStandings(teams, matches);
    const headers = ['Rank', 'Team Name', 'Played', 'Won', 'Drawn', 'Lost', 'GF', 'GA', 'GD', 'PTS'];
    const rows = standings.map(s => [
      s.rank,
      s.teamName,
      s.played,
      s.won,
      s.drawn,
      s.lost,
      s.goalsFor,
      s.goalsAgainst,
      s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference,
      s.points
    ]);

    return {
      title: 'Tournament Standings & Points Table',
      subtitle: 'Official ranking calculated by Points (Win=3, Draw=1), Goal Difference, and Goals For',
      headers,
      rows
    };
  }

  // 2. Generate Fixture Report (Upcoming)
  public static generateFixtureReport(
    matches: Match[],
    teams: Team[],
    venues: Venue[],
    referees: Referee[]
  ): ReportData {
    const teamMap = new Map(teams.map(t => [t.id, t.name]));
    const venueMap = new Map(venues.map(v => [v.id, v.name]));
    const refMap = new Map(referees.map(r => [r.id, r.name]));

    const scheduled = matches.filter(m => m.status === 'Scheduled');
    const headers = ['Match ID', 'Date', 'Time', 'Home Team', 'Away Team', 'Venue', 'Referee', 'Status'];
    const rows = scheduled.map(m => [
      m.id,
      m.date,
      m.time,
      teamMap.get(m.homeTeamId) || m.homeTeamId,
      teamMap.get(m.awayTeamId) || m.awayTeamId,
      venueMap.get(m.venueId) || m.venueId,
      refMap.get(m.refereeId) || m.refereeId,
      m.status
    ]);

    return {
      title: 'Upcoming Tournament Fixtures',
      subtitle: `Scheduled matches slated for upcoming match days (${scheduled.length} fixtures)`,
      headers,
      rows
    };
  }

  // 3. Generate Match Results Report
  public static generateMatchReport(
    matches: Match[],
    teams: Team[],
    venues: Venue[],
    referees: Referee[]
  ): ReportData {
    const teamMap = new Map(teams.map(t => [t.id, t.name]));
    const venueMap = new Map(venues.map(v => [v.id, v.name]));
    const refMap = new Map(referees.map(r => [r.id, r.name]));

    const completed = matches.filter(m => m.status === 'Completed');
    const headers = ['Match ID', 'Date', 'Home Team', 'Score', 'Away Team', 'Winner', 'Venue', 'Referee'];
    const rows = completed.map(m => {
      const home = teamMap.get(m.homeTeamId) || m.homeTeamId;
      const away = teamMap.get(m.awayTeamId) || m.awayTeamId;
      const winner = m.winnerId === 'DRAW' ? 'Draw' : (teamMap.get(m.winnerId || '') || 'Draw');
      return [
        m.id,
        m.date,
        home,
        `${m.homeScore} - ${m.awayScore}`,
        away,
        winner,
        venueMap.get(m.venueId) || m.venueId,
        refMap.get(m.refereeId) || m.refereeId
      ];
    });

    return {
      title: 'Match Results History & Scores',
      subtitle: `Official records of all completed tournament fixtures (${completed.length} matches)`,
      headers,
      rows
    };
  }

  // 4. Generate Player Report
  public static generatePlayerReport(players: Player[], teams: Team[]): ReportData {
    const teamMap = new Map(teams.map(t => [t.id, t.name]));
    const headers = ['ID', 'Player Name', 'Team', 'Position', 'Jersey', 'Age', 'Goals', 'Assists', 'Matches', 'YC', 'RC', 'Status'];
    const rows = [...players]
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
      .map(p => [
        p.id,
        p.name,
        teamMap.get(p.teamId) || 'Unassigned',
        p.position,
        p.jerseyNumber,
        p.age,
        p.goals,
        p.assists,
        p.matchesPlayed,
        p.yellowCards,
        p.redCards,
        p.status
      ]);

    return {
      title: 'Tournament Player Statistics & Leaderboard',
      subtitle: 'Complete squad stats, golden boot race, discipline, and participation',
      headers,
      rows
    };
  }

  // 5. Generate Team Report
  public static generateTeamReport(teams: Team[], players: Player[]): ReportData {
    const headers = ['ID', 'Team Name', 'Coach', 'Captain', 'City', 'Players', 'Wins', 'Draws', 'Losses', 'GF', 'GA', 'Points'];
    const rows = teams.map(t => {
      const playerCount = players.filter(p => p.teamId === t.id).length;
      return [
        t.id,
        t.name,
        t.coach,
        t.captain,
        t.city,
        playerCount,
        t.wins,
        t.draws,
        t.losses,
        t.goalsFor,
        t.goalsAgainst,
        t.points
      ];
    });

    return {
      title: 'Registered Teams & Coaching Staff',
      subtitle: 'Comprehensive team overview, squad size, management, and standings record',
      headers,
      rows
    };
  }

  // 6. Generate Venue Report
  public static generateVenueReport(venues: Venue[], matches: Match[]): ReportData {
    const headers = ['ID', 'Venue Name', 'City', 'Address', 'Capacity', 'Matches Hosted', 'Availability'];
    const rows = venues.map(v => {
      const matchCount = matches.filter(m => m.venueId === v.id).length;
      return [
        v.id,
        v.name,
        v.city,
        v.address,
        v.capacity.toLocaleString(),
        matchCount,
        v.availability
      ];
    });

    return {
      title: 'Tournament Venues & Facility Utilization',
      subtitle: 'Stadium capacity, physical locations, booking status, and match allocation',
      headers,
      rows
    };
  }

  // 7. Generate Referee Report
  public static generateRefereeReport(referees: Referee[], matches: Match[]): ReportData {
    const headers = ['ID', 'Referee Name', 'Experience (Yrs)', 'Assigned Matches', 'Phone', 'Email', 'Status'];
    const rows = referees.map(r => {
      const assigned = matches.filter(m => m.refereeId === r.id).length;
      return [
        r.id,
        r.name,
        `${r.experience} yrs`,
        assigned,
        r.phone,
        r.email,
        r.status
      ];
    });

    return {
      title: 'Officiating Referees & Match Assignments',
      subtitle: 'Official tournament referee corps, experience credentials, and officiating workload',
      headers,
      rows
    };
  }

  // 8. Generate Tournament Summary Report
  public static generateTournamentSummaryReport(
    teams: Team[],
    players: Player[],
    matches: Match[],
    venues: Venue[],
    referees: Referee[]
  ): ReportData {
    const analytics = AnalyticsService.computeAnalytics(teams, players, matches, venues, referees);
    const headers = ['Metric', 'Details', 'Key Insight'];
    const rows = [
      ['Tournament Champion (Current)', analytics.champion?.name || 'N/A', `${analytics.champion?.points || 0} Points, GD: +${(analytics.champion?.goalsFor || 0) - (analytics.champion?.goalsAgainst || 0)}`],
      ['Tournament Runner Up', analytics.runnerUp?.name || 'N/A', `${analytics.runnerUp?.points || 0} Points`],
      ['Golden Boot (Top Scorer)', `${analytics.topScorer?.player.name} (${analytics.topScorer?.teamName})`, `${analytics.topScorer?.player.goals} Goals scored`],
      ['Tournament MVP', `${analytics.mvp?.player.name} (${analytics.mvp?.teamName})`, `Impact Rating: ${analytics.mvp?.rating} (${analytics.mvp?.player.goals}G, ${analytics.mvp?.player.assists}A)`],
      ['Total Goals Scored', analytics.totalGoals, `Average: ${analytics.averageGoalsPerMatch} goals/match`],
      ['Highest Scoring Match', `${analytics.highestScoringMatch?.homeTeamName} vs ${analytics.highestScoringMatch?.awayTeamName}`, `${analytics.highestScoringMatch?.totalGoals} Total Goals`],
      ['Best Attacking Team', analytics.bestAttack?.team.name || 'N/A', `${analytics.bestAttack?.goals} goals scored`],
      ['Best Defending Team', analytics.bestDefense?.team.name || 'N/A', `Only ${analytics.bestDefense?.goalsConceded} goals conceded`],
      ['Total Matches Scheduled', analytics.totalMatches, `${analytics.completedMatches} Completed, ${analytics.upcomingMatches} Scheduled`],
      ['Decisive Win Percentage', `${analytics.winPercentage}%`, `${analytics.drawPercentage}% Draws`],
      ['Registered Teams', teams.length, `${players.length} Total Registered Athletes`],
      ['Stadium Venues', venues.length, `${venues.reduce((acc, v) => acc + v.capacity, 0).toLocaleString()} Total Tournament Capacity`],
      ['Match Officials', referees.length, 'Certified FIFA/National Standard']
    ];

    return {
      title: 'Tournament Executive Summary & Key Indicators',
      subtitle: 'High-level executive briefing across all competitive, operational, and officiating metrics',
      headers,
      rows
    };
  }
}
