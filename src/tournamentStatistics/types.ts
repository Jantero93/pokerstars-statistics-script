import { ConsoleColor } from '../utils/logger';

/***
 * General statistics type for tournament and sit & go's
 */

/**
 * @type {TournamentStats} - Tournament statistics including SNG's and tournaments
 * @property buyIns - Sum of costs (buy-in + rake)
 * @property earning - Earnings from
 * @property tournamentCount - How many SNG's or tournaments have played
 * @property tournamentWins - How many tournament have won
 */
export type TournamentStats = {
  buyIns: number;
  earnings: number;
  tournamentCount: number;
  tournamentWins: number;
  rake: number;
};

/**
 * @returns {TournamentStats} Initializes general tournament and sit & go statistics object
 */
export const createTournamentStatsObject = (): TournamentStats => ({
  buyIns: 0,
  earnings: 0,
  tournamentCount: 0,
  tournamentWins: 0,
  rake: 0
});

/**
 * Final logging type
 * @property {PokerGame} key - Game name
 * @property value - Logged string text
 * @property color? - Colorize output on console, optional
 */
export type LoggingOutput = Record<
  string,
  { value: string; color?: ConsoleColor }
>;
