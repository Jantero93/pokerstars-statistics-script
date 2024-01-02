/**
 * Poker games script can detect
 */
export enum PokerGame {
  "Tempest Hold'em No Limit" = "Tempest Hold'em No Limit",
  '7 Card Stud Hi/Lo' = '7 Card Stud Hi/Lo',
  '7 Card Stud' = '7 Card Stud',
  "Hold'em Limit" = "Hold'em Limit",
  "Hold'em No Limit" = "Hold'em No Limit",
  'Omaha Hi/Lo Limit' = 'Omaha Hi/Lo Limit',
  'Omaha Hi/Lo Pot Limit' = 'Omaha Hi/Lo Pot Limit',
  'Triple Draw 2-7 Lowball' = 'Triple Draw 2-7 Lowball',
  'Omaha Pot Limit' = 'Omaha Pot Limit',
  'Razz' = 'Razz',
  '5 Card Draw No Limit' = '5 Card Draw No Limit',
  'Omaha No Limit' = 'Omaha No Limit',
  'UNKNOWN' = 'UNKNOWN'
}

export const createKnownGamesList = (): PokerGame[] =>
  Array.from(new Set(Object.values(PokerGame)));

/**
 * @returns {string} Find longest string of known games
 */
export const findLongestGameName = (): string =>
  createKnownGamesList().reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ''
  );

export type PokerGameRecord = Record<PokerGame, number>;

/**
 * @returns {PokerGameRecord} Initialize record of pokergame and number
 */
export const createPokerGamesNumberRecord = (): PokerGameRecord =>
  Object.keys(PokerGame).reduce((acc, key) => {
    acc[key as PokerGame] = 0;
    return acc;
  }, {} as PokerGameRecord);
