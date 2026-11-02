import { Team, Player, Match, Venue, Referee } from '../types';

export interface SearchResultItem {
  id: string;
  type: 'team' | 'player' | 'match' | 'venue' | 'referee';
  title: string;
  subtitle: string;
  details: string;
  badge?: string;
  originalEntity: Team | Player | Match | Venue | Referee;
}

export class SearchService {
  /**
   * Unified multi-entity search
   */
  public static searchAll(
    query: string,
    teams: Team[],
    players: Player[],
    matches: Match[],
    venues: Venue[],
    referees: Referee[]
  ): SearchResultItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // Helper map for fast lookup
    const teamMap = new Map(teams.map(t => [t.id, t.name]));
    const venueMap = new Map(venues.map(v => [v.id, v.name]));
    const refMap = new Map(referees.map(r => [r.id, r.name]));

    // 1. Search Teams (Team Name, Coach, Captain, City, ID, Description)
    for (const team of teams) {
      if (
        team.id.toLowerCase().includes(q) ||
        team.name.toLowerCase().includes(q) ||
        team.coach.toLowerCase().includes(q) ||
        team.captain.toLowerCase().includes(q) ||
        team.city.toLowerCase().includes(q) ||
        team.description.toLowerCase().includes(q)
      ) {
        results.push({
          id: team.id,
          type: 'team',
          title: team.name,
          subtitle: `Coach: ${team.coach} | Captain: ${team.captain}`,
          details: `City: ${team.city} • Points: ${team.points} • Record: ${team.wins}W-${team.draws}D-${team.losses}L`,
          badge: 'TEAM',
          originalEntity: team
        });
      }
    }

    // 2. Search Players (Player Name, ID, Team, Position, Status)
    for (const player of players) {
      const pTeamName = teamMap.get(player.teamId) || 'Unassigned';
      if (
        player.id.toLowerCase().includes(q) ||
        player.name.toLowerCase().includes(q) ||
        player.position.toLowerCase().includes(q) ||
        player.status.toLowerCase().includes(q) ||
        pTeamName.toLowerCase().includes(q) ||
        player.jerseyNumber.toString() === q
      ) {
        results.push({
          id: player.id,
          type: 'player',
          title: `${player.name} (#${player.jerseyNumber})`,
          subtitle: `${player.position} • Team: ${pTeamName}`,
          details: `Age: ${player.age} • Goals: ${player.goals} • Assists: ${player.assists} • Status: ${player.status}`,
          badge: player.position.toUpperCase(),
          originalEntity: player
        });
      }
    }

    // 3. Search Matches (Match ID, Teams, Venue, Referee, Date, Status)
    for (const match of matches) {
      const home = teamMap.get(match.homeTeamId) || match.homeTeamId;
      const away = teamMap.get(match.awayTeamId) || match.awayTeamId;
      const venueName = venueMap.get(match.venueId) || match.venueId;
      const refName = refMap.get(match.refereeId) || match.refereeId;

      if (
        match.id.toLowerCase().includes(q) ||
        home.toLowerCase().includes(q) ||
        away.toLowerCase().includes(q) ||
        venueName.toLowerCase().includes(q) ||
        refName.toLowerCase().includes(q) ||
        match.date.toLowerCase().includes(q) ||
        match.status.toLowerCase().includes(q)
      ) {
        const scoreText = match.status === 'Completed' ? `${match.homeScore} - ${match.awayScore}` : 'vs';
        results.push({
          id: match.id,
          type: 'match',
          title: `${home} ${scoreText} ${away}`,
          subtitle: `${match.date} at ${match.time} • ${venueName}`,
          details: `Status: ${match.status} • Referee: ${refName} • Match ID: ${match.id}`,
          badge: match.status.toUpperCase(),
          originalEntity: match
        });
      }
    }

    // 4. Search Venues (Venue Name, City, Address, ID, Availability)
    for (const venue of venues) {
      if (
        venue.id.toLowerCase().includes(q) ||
        venue.name.toLowerCase().includes(q) ||
        venue.city.toLowerCase().includes(q) ||
        venue.address.toLowerCase().includes(q) ||
        venue.availability.toLowerCase().includes(q)
      ) {
        results.push({
          id: venue.id,
          type: 'venue',
          title: venue.name,
          subtitle: `${venue.address}, ${venue.city}`,
          details: `Capacity: ${venue.capacity.toLocaleString()} • Availability: ${venue.availability}`,
          badge: 'VENUE',
          originalEntity: venue
        });
      }
    }

    // 5. Search Referees (Referee Name, Email, Phone, ID, Status)
    for (const ref of referees) {
      if (
        ref.id.toLowerCase().includes(q) ||
        ref.name.toLowerCase().includes(q) ||
        ref.email.toLowerCase().includes(q) ||
        ref.phone.toLowerCase().includes(q) ||
        ref.status.toLowerCase().includes(q)
      ) {
        results.push({
          id: ref.id,
          type: 'referee',
          title: ref.name,
          subtitle: `${ref.experience} Years Experience • Assigned Matches: ${ref.assignedMatches}`,
          details: `Contact: ${ref.email} | ${ref.phone} • Status: ${ref.status}`,
          badge: 'REFEREE',
          originalEntity: ref
        });
      }
    }

    return results;
  }
}
