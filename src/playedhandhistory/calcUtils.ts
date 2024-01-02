import { PokerGameRecord } from '../types/general';

export const calcAllHandsPlayed = (stats: PokerGameRecord): number =>
  Object.values(stats).reduce((sum, count) => sum + count, 0);
