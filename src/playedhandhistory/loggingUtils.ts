import ENV from '../utils/env/main';
import { PokerGameRecord, findLongestGameName } from '../types/general';
import { localizeNumber } from '../utils/stringUtils';
import { SPACE } from '../../globalConsts';

export const createLoggingOutputPlayedHands = (
  stats: PokerGameRecord
): string[] =>
  Object.entries(stats)
    .filter(([_game, value]) => value >= ENV.MIN_GAMES_SHOW)
    .map(([game, playedHandsCount]) => {
      const spaces = SPACE.repeat(
        findLongestGameName().length - game.length + 2
      );
      return `${game}${spaces}${localizeNumber(playedHandsCount)}`;
    });

export const createLoggingOutputEarnings = (stats: PokerGameRecord): string[] =>
  Object.entries(stats)
    .filter(
      ([_game, amount]) =>
        amount < -ENV.EARNINGS_AMOUNT_SHOW || amount > ENV.EARNINGS_AMOUNT_SHOW
    )
    .map(([game, playedHandsCount]) => {
      const spaces = SPACE.repeat(
        findLongestGameName().length - game.length + 2
      );
      return `${game}${spaces}${localizeNumber(playedHandsCount)}`;
    });

export const createLinebreak = (logStrings: string[]): string => {
  const dashCharacter = '-';
  const longestLogStringLenght = logStrings.reduce(
    (maxLength, currentString) => Math.max(maxLength, currentString.length),
    0
  );
  return dashCharacter.repeat(longestLogStringLenght + dashCharacter.length);
};
