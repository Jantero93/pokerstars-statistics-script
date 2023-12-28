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
  | 'Razz';

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
  'Razz'
];

export const findLongestGameName = (): string =>
  createKnownGamesList().reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    ''
  );

export type PlayedHands = Record<PokerGame | 'UNKNOWN', number>;

/**
 * @returns Initialize record of game and played hands
 */
export const createPlayedHandsObject = (): PlayedHands => ({
  '7 Card Stud Hi/Lo': 0,
  '7 Card Stud': 0,
  "Hold'em Limit": 0,
  "Hold'em No Limit": 0,
  'Omaha Hi/Lo Limit': 0,
  'Omaha Hi/Lo Pot Limit': 0,
  'Triple Draw 2-7 Lowball': 0,
  'Omaha Pot Limit': 0,
  Razz: 0,
  UNKNOWN: 0
});

/***
 * General statistics type for tournament and sit & go's
 */
export type TournamentStats = {
  buyIns: number;
  wins: number;
  tournamentCount: number;
  tournamentWins: number;
};

/**
 * @returns Initializes general tournament and sit & go statistics object
 */
export const createTournamentStatsObject = (): TournamentStats => ({
  buyIns: 0,
  wins: 0,
  tournamentCount: 0,
  tournamentWins: 0
});
