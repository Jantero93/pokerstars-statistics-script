import ENV from '../utils/env/main';
import { PokerGameRecord, findLongestGameName } from '../types/general';
import { localizeNumber } from '../utils/stringUtils';
import { SPACE } from '../../globalConsts';

export const createLoggingOutput = (stats: PokerGameRecord): string[] =>
  Object.entries(stats)
    .filter(
      ([_game, playedHandsCount]) => playedHandsCount >= ENV.MIN_GAMES_SHOW
    )
    .map(([game, playedHandsCount]) => {
      const spaces = SPACE.repeat(findLongestGameName().length - game.length + 2);
      return `${game}${spaces}${localizeNumber(playedHandsCount)}`;
    });

export const createLinebreak = (logStrings: string[]): string => {
  /** linebreak */
  const dashCharacter = '-';
  const longestLogStringLength = logStrings.reduce(
    (maxLength, currentString) => Math.max(maxLength, currentString.length),
    0
  );
  return dashCharacter.repeat(longestLogStringLength + dashCharacter.length);
};
