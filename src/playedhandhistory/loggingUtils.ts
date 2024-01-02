import ENV from '../utils/env/main';
import { PokerGameRecord, findLongestGameName } from '../types/general';
import { localizeNumber } from '../utils/stringUtils';

export const createLoggingOutput = (stats: PokerGameRecord): string[] =>
  Object.entries(stats)
    .filter(
      ([_game, playedHandsCount]) => playedHandsCount >= ENV.MIN_GAMES_SHOW
    )
    .map(([game, playedHandsCount]) => {
      const spaces = ' '.repeat(findLongestGameName().length - game.length + 2);
      return `${game}${spaces}${localizeNumber(playedHandsCount)}`;
    });

export const createLinebreak = (logStrings: string[]): string => {
  /** linebreak */
  const character = '-';
  const longestLogStringLenght = logStrings.reduce(
    (maxLength, currentString) => Math.max(maxLength, currentString.length),
    0
  );
  return character.repeat(longestLogStringLenght + character.length);
};
