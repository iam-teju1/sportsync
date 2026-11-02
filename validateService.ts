import { Team, Player, Match, Venue, Referee } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ValidateService {
  // Regex patterns
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

  /**
   * Validate Email
   */
  public static isValidEmail(email: string): boolean {
    return this.emailRegex.test(email.trim());
  }

  /**
   * Validate Phone Number
   */
  public static isValidPhone(phone: string): boolean {
    return this.phoneRegex.test(phone.trim());
  }

  /**
   * Validate Age (sports range, typically 14 to 60)
   */
  public static isValidAge(age: number): boolean {
    return Number.isInteger(age) && age >= 14 && age <= 60;
  }

  /**
   * Validate Team form
   */
  public static validateTeam(
    team: Partial<Team>,
    existingTeams: Team[],
    isEditing = false
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!team.id?.trim()) {
      errors.id = 'Team ID is required (e.g., TM-07)';
    } else if (!isEditing && existingTeams.some(t => t.id.toLowerCase() === team.id!.trim().toLowerCase())) {
      errors.id = `Team ID "${team.id}" already exists. Must be unique.`;
    }

    if (!team.name?.trim()) {
      errors.name = 'Team Name is required';
    } else if (
      existingTeams.some(
        t => t.name.toLowerCase() === team.name!.trim().toLowerCase() && (!isEditing || t.id !== team.id)
      )
    ) {
      errors.name = `A team named "${team.name}" already exists.`;
    }

    if (!team.coach?.trim()) {
      errors.coach = 'Coach name is required';
    }

    if (!team.captain?.trim()) {
      errors.captain = 'Captain name is required';
    }

    if (!team.city?.trim()) {
      errors.city = 'City is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate Player form
   */
  public static validatePlayer(
    player: Partial<Player>,
    existingPlayers: Player[],
    existingTeams: Team[],
    isEditing = false
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!player.id?.trim()) {
      errors.id = 'Player ID is required (e.g., PL-21)';
    } else if (!isEditing && existingPlayers.some(p => p.id.toLowerCase() === player.id!.trim().toLowerCase())) {
      errors.id = `Player ID "${player.id}" already exists. Must be unique.`;
    }

    if (!player.name?.trim()) {
      errors.name = 'Player Name is required';
    }

    if (player.age === undefined || player.age === null || isNaN(player.age)) {
      errors.age = 'Age is required';
    } else if (!this.isValidAge(player.age)) {
      errors.age = 'Player age must be between 14 and 60 years';
    }

    if (!player.position) {
      errors.position = 'Playing position is required';
    }

    if (player.jerseyNumber === undefined || player.jerseyNumber === null || isNaN(player.jerseyNumber)) {
      errors.jerseyNumber = 'Jersey number is required';
    } else if (player.jerseyNumber < 1 || player.jerseyNumber > 99) {
      errors.jerseyNumber = 'Jersey number must be between 1 and 99';
    } else if (player.teamId) {
      // Check if jersey number is already taken in the same team
      const jerseyConflict = existingPlayers.some(
        p => p.teamId === player.teamId &&
             p.jerseyNumber === player.jerseyNumber &&
             (!isEditing || p.id !== player.id)
      );
      if (jerseyConflict) {
        errors.jerseyNumber = `Jersey #${player.jerseyNumber} is already taken in this team.`;
      }
    }

    if (!player.teamId) {
      errors.teamId = 'Player must be assigned to a team';
    } else if (!existingTeams.some(t => t.id === player.teamId)) {
      errors.teamId = 'Selected team does not exist';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate Venue form
   */
  public static validateVenue(
    venue: Partial<Venue>,
    existingVenues: Venue[],
    isEditing = false
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!venue.id?.trim()) {
      errors.id = 'Venue ID is required (e.g., VN-05)';
    } else if (!isEditing && existingVenues.some(v => v.id.toLowerCase() === venue.id!.trim().toLowerCase())) {
      errors.id = `Venue ID "${venue.id}" already exists. Must be unique.`;
    }

    if (!venue.name?.trim()) {
      errors.name = 'Venue Name is required';
    }

    if (!venue.address?.trim()) {
      errors.address = 'Address is required';
    }

    if (!venue.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!venue.capacity || isNaN(venue.capacity) || venue.capacity <= 0) {
      errors.capacity = 'Capacity must be a positive integer greater than 0';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate Referee form
   */
  public static validateReferee(
    ref: Partial<Referee>,
    existingReferees: Referee[],
    isEditing = false
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!ref.id?.trim()) {
      errors.id = 'Referee ID is required (e.g., RF-05)';
    } else if (!isEditing && existingReferees.some(r => r.id.toLowerCase() === ref.id!.trim().toLowerCase())) {
      errors.id = `Referee ID "${ref.id}" already exists. Must be unique.`;
    }

    if (!ref.name?.trim()) {
      errors.name = 'Referee name is required';
    }

    if (ref.experience === undefined || ref.experience === null || isNaN(ref.experience) || ref.experience < 0) {
      errors.experience = 'Experience must be 0 or more years';
    }

    if (!ref.email?.trim()) {
      errors.email = 'Email address is required';
    } else if (!this.isValidEmail(ref.email)) {
      errors.email = 'Invalid email address format (e.g. name@domain.com)';
    }

    if (!ref.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!this.isValidPhone(ref.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate Match Scheduling & Conflict Prevention
   * Business Rules:
   * - A match requires two different teams
   * - A venue cannot be double booked (same date & overlapping time)
   * - A referee cannot officiate two matches at the same time
   */
  public static validateMatch(
    match: Partial<Match>,
    existingMatches: Match[],
    existingVenues: Venue[],
    existingReferees: Referee[],
    isEditing = false
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!match.id?.trim()) {
      errors.id = 'Match ID is required (e.g., MT-19)';
    } else if (!isEditing && existingMatches.some(m => m.id.toLowerCase() === match.id!.trim().toLowerCase())) {
      errors.id = `Match ID "${match.id}" already exists. Must be unique.`;
    }

    if (!match.homeTeamId) {
      errors.homeTeamId = 'Home team is required';
    }

    if (!match.awayTeamId) {
      errors.awayTeamId = 'Away team is required';
    }

    if (match.homeTeamId && match.awayTeamId && match.homeTeamId === match.awayTeamId) {
      errors.awayTeamId = 'A match requires two different teams. Home and away teams cannot be identical.';
    }

    if (!match.venueId) {
      errors.venueId = 'Venue is required';
    } else {
      const v = existingVenues.find(vn => vn.id === match.venueId);
      if (v && v.availability === 'Maintenance') {
        errors.venueId = 'Selected venue is currently undergoing maintenance and unavailable for booking.';
      }
    }

    if (!match.refereeId) {
      errors.refereeId = 'Referee is required';
    } else {
      const r = existingReferees.find(rf => rf.id === match.refereeId);
      if (r && r.status !== 'Active') {
        errors.refereeId = `Selected referee is currently ${r.status.toLowerCase()} and cannot officiate.`;
      }
    }

    if (!match.date?.trim()) {
      errors.date = 'Match date is required';
    }

    if (!match.time?.trim()) {
      errors.time = 'Match kickoff time is required';
    }

    // Scheduling Conflict Checks
    if (match.date && match.time && match.venueId) {
      // Check Venue Double Booking
      const venueConflict = existingMatches.find(
        m => m.date === match.date &&
             m.time === match.time &&
             m.venueId === match.venueId &&
             m.status !== 'Cancelled' &&
             (!isEditing || m.id !== match.id)
      );

      if (venueConflict) {
        errors.venueId = `Venue Double Booking Conflict: Venue is already booked for match ${venueConflict.id} on ${match.date} at ${match.time}.`;
      }
    }

    if (match.date && match.time && match.refereeId) {
      // Check Referee Double Booking
      const refConflict = existingMatches.find(
        m => m.date === match.date &&
             m.time === match.time &&
             m.refereeId === match.refereeId &&
             m.status !== 'Cancelled' &&
             (!isEditing || m.id !== match.id)
      );

      if (refConflict) {
        errors.refereeId = `Referee Double Booking Conflict: Referee is already assigned to match ${refConflict.id} on ${match.date} at ${match.time}.`;
      }
    }

    if (match.date && match.time && (match.homeTeamId || match.awayTeamId)) {
      // Check Team Double Booking (a team cannot play two matches at the same time)
      const teamConflict = existingMatches.find(
        m => m.date === match.date &&
             m.time === match.time &&
             m.status !== 'Cancelled' &&
             (!isEditing || m.id !== match.id) &&
             (m.homeTeamId === match.homeTeamId ||
              m.awayTeamId === match.homeTeamId ||
              m.homeTeamId === match.awayTeamId ||
              m.awayTeamId === match.awayTeamId)
      );

      if (teamConflict) {
        errors.homeTeamId = `Team Scheduling Conflict: One of the selected teams is already playing match ${teamConflict.id} on this date & time.`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate Match Scores
   */
  public static validateScore(homeScore: number, awayScore: number): ValidationResult {
    const errors: Record<string, string> = {};

    if (isNaN(homeScore) || homeScore < 0) {
      errors.homeScore = 'Home score must be 0 or a positive integer';
    }

    if (isNaN(awayScore) || awayScore < 0) {
      errors.awayScore = 'Away score must be 0 or a positive integer';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}
