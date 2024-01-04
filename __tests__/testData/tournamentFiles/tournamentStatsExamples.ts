/**
 * - Win percentage 20 %
 * - Earning compared to buy-ins 200 %
 */
export const testTournamentStats1 = {
  buyIns: 5000,
  earnings: 15000,
  tournamentCount: 25,
  tournamentWins: 5
} as const;

/**
 * - Win percentage 33,33 %
 * - Earning compared to buy-ins -41,1467 % => -41,15 %
 */
export const testTournamentStats2 = {
  buyIns: 12000,
  earnings: 7000,
  tournamentCount: 3,
  tournamentWins: 1
} as const;
