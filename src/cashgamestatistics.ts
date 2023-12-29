import * as fs from 'fs';
import { ENV } from './utils/env/env';
import { createPokerGamesNumberRecord, PokerGame } from './types/general';

const SUMMARY_HEADER = '*** SUMMARY ***';
const POKERSTARTS_HEADER = 'PokerStars Hand #';

type LosingTerm = 'folded' | 'lost' | 'mucked';
type WinningTerm = 'collected' | 'won';
type ActionTerm = 'bets' | 'calls' | 'raises' | 'posts';
type Term = WinningTerm | LosingTerm | ActionTerm;

// Value is number so its valid for calculation cash sums
const _wonGames = createPokerGamesNumberRecord();
const _lostGames = createPokerGamesNumberRecord();

let rake = 0;
let playedHands = 0;

const txtContentByGame: Record<PokerGame | 'UNKNOWN', string[][]> = {
  '7 Card Stud Hi/Lo': [],
  '7 Card Stud': [],
  "Hold'em Limit": [],
  "Hold'em No Limit": [],
  'Omaha Hi/Lo Limit': [],
  'Omaha Hi/Lo Pot Limit': [],
  'Triple Draw 2-7 Lowball': [],
  'Omaha Pot Limit': [],
  Razz: [],
  UNKNOWN: []
};

const readAllCashGameEarnings = (folderPath: string) => {
  const filepaths = fs
    .readdirSync(folderPath)
    .filter((filename) => filename.endsWith('.txt'));

  throw new Error('Not implemented yet');
};

readAllCashGameEarnings(ENV.HAND_HISTORY_FOLDER_PATH);

// Helper functions
function isLineKeywordAndPlayer(line: string) {
  const keywords: Term[] = [
    'collected',
    'folded',
    'lost',
    'mucked',
    'won',
    'raises',
    'bets',
    'calls'
  ];

  return (
    keywords.some((word) => line.includes(word)) &&
    line.includes(ENV.PLAYER_NAME)
  );
}
