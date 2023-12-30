/**
 * General
 */
export type PokerGame =
  | '7 Card Stud Hi/Lo'
  | '7 Card Stud'
  | "Hold'em Limit"
  | "Hold'em No Limit"
  | 'Omaha Hi/Lo Limit'
  | 'Omaha Hi/Lo Pot Limit'
  | 'Triple Draw 2-7 Lowball'
  | 'Omaha Pot Limit'
  | 'Razz'
  | '5 Card Draw No Limit'
  | 'Omaha No Limit';

/**
 * @returns Create array of strings known poker games
 */
export const createKnownGamesList = (): PokerGame[] => [
  '7 Card Stud Hi/Lo',
  '7 Card Stud',
  "Hold'em Limit",
  "Hold'em No Limit",
  'Omaha Hi/Lo Limit',
  'Omaha Hi/Lo Pot Limit',
  'Triple Draw 2-7 Lowball',
  'Omaha Pot Limit',
  'Razz',
  '5 Card Draw No Limit',
  'Omaha No Limit'
];

export const findLongestGameName = () =>
  createKnownGamesList().reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ''
  );

export type PokerGameRecord = Record<PokerGame | 'UNKNOWN', number>;

/**
 * @returns Initialize record of pokergame and number
 */
export const createPokerGamesNumberRecord = (): PokerGameRecord => ({
  '7 Card Stud Hi/Lo': 0,
  '7 Card Stud': 0,
  "Hold'em Limit": 0,
  "Hold'em No Limit": 0,
  'Omaha Hi/Lo Limit': 0,
  'Omaha Hi/Lo Pot Limit': 0,
  'Triple Draw 2-7 Lowball': 0,
  'Omaha Pot Limit': 0,
  Razz: 0,
  UNKNOWN: 0,
  '5 Card Draw No Limit': 0,
  'Omaha No Limit': 0
});
