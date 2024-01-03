import { TournamentStats } from '../types/tournament';
import ENV from '../utils/env/main';
import { EMPTY_STRING } from '../../globalConsts.js';

/**
 * Calculate helpers for each tournament file stats
 */
export const calcWinSum = (lines: string[]): number => {
  const playerLine = lines
    .map((line) => line.trim())
    .find((line) => line.includes(ENV.PLAYER_NAME));

  const parts = playerLine?.split(' ');
  if (!parts || parts.length < 4) return 0;

  const win = Number(parts[3].split(',').join(EMPTY_STRING));

  return Number.isNaN(win) ? 0 : win;
};

export const calcBuyIn = (lines: string[]): number => {
  const buyInRaw = lines.find((line) => line.includes('Buy-In'))?.split(':')[1];

  if (!buyInRaw) {
    throw new Error(`Could not find buy-in for the tournament, lines:\n
      ${lines}`);
  }

  const [buyIn, rake] = buyInRaw.split('/').map(Number);
  return buyIn + rake;
};

export const calcReEntriesSum = (lines: string[]): number => {
  const reEntryLine = lines.find((line) => line.includes('re-entries'));
  if (!reEntryLine) return 0;

  return Number(reEntryLine.split(' ')[8].split(',').join(EMPTY_STRING));
};

export const didWinTournament = (lines: string[]) =>
  lines.some((line) => line.includes('You finished in 1st place'));

/**
 * Additional helpers
 */
export const calcTournamentWinPercentage = (stats: TournamentStats): number => {
  const { tournamentCount, tournamentWins } = stats;

  if (tournamentCount === 0 || tournamentWins === 0) {
    return 0;
  }

  return (tournamentWins / tournamentCount) * 100;
};

export const calcEarningComparedToCosts = (
  costs: number,
  earnings: number
): number => {
  if (costs === 0) return 0;

  return ((earnings - costs) / costs) * 100;
};
