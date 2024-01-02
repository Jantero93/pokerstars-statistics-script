import { PokerGameRecord } from '../types/general';

export const calcAllHandsPlayed = (stats: PokerGameRecord) =>
  Object.values(stats).reduce((sum, count) => sum + count, 0);
