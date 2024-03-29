import { TournamentStats } from './types';
import ENV from '../utils/env/main';
import { EMPTY_STRING, SPACE } from '../../globalConsts.js';

/**
 * Calculate helpers for each tournament file stats
 */
export const calcWinSum = (lines: string[]): number => {
  const playerLine = lines
    .map((line) => line.trim())
    .find((line) => line.includes(ENV.PLAYER_NAME));

  const parts = playerLine?.split(SPACE);
  if (!parts || parts.length < 4) return 0;

  const win = Number(parts[3].split(',').join(EMPTY_STRING));

  return Number.isNaN(win) ? 0 : win;
};

export const calcBuyIn = (lines: string[]): number => {
  const buyInRaw = lines.find((line) => line.includes('Buy-In'))?.split(':')[1];

  if (buyInRaw) {
    const [buyIn, rake] = buyInRaw.split('/').map(Number);
    return buyIn + rake;
  }

  const isFreerollTournament = lines.find((line) =>
    line.toLowerCase().includes('freeroll')
  );

  if (isFreerollTournament) {
    return 0;
  }

  throw new Error(`Could not find buy-in for the tournament, lines:\n
    ${lines}`);
};

export const getRake = (lines: string[]): number => {
  const buyInRaw = lines.find((line) => line.includes('Buy-In'))?.split(':')[1];

  if (buyInRaw) {
    const [_buyIn, rake] = buyInRaw.split('/').map(Number);
    return rake;
  }

  const isFreerollTournament = lines.find((line) =>
    line.toLowerCase().includes('freeroll')
  );

  if (isFreerollTournament) {
    return 0;
  }

  throw new Error(`Could not find rake (or freeroll marker) for the tournament, lines:\n
    ${lines}`);
};

export const calcReEntriesSum = (lines: string[]): number => {
  const reEntryLine = lines.find((line) => line.includes('re-entries'));
  if (!reEntryLine) return 0;

  return Number(reEntryLine.split(SPACE)[8].split(',').join(EMPTY_STRING));
};

export const didWinTournament = (lines: string[]): boolean =>
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
