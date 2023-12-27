import * as fs from 'fs';
import * as path from 'path';
import ENV from './env';

const SUMMARY_HEADER = '*** SUMMARY ***';
const POKERSTARTS_HEADER = 'PokerStars Hand #';

type LosingTerm = 'folded' | 'lost' | 'mucked';
type WinningTerm = 'collected' | 'won';
type ActionTerm = 'bets' | 'calls' | 'raises' | 'posts';
type Term = WinningTerm | LosingTerm | ActionTerm;

type SummaryHeader = typeof SUMMARY_HEADER;
type PokerStarsHeader = typeof POKERSTARTS_HEADER;

type PokerHeader = SummaryHeader | PokerStarsHeader;

type PokerGame =
  | '7 Card Stud Hi/Lo'
  | '7 Card Stud'
  | "Hold'em Limit"
  | "Hold'em No Limit"
  | 'Omaha Hi/Lo Limit'
  | 'Omaha Hi/Lo Pot Limit'
  | 'Triple Draw 2-7 Lowball'
  | 'Omaha Pot Limit'
  | 'Razz'
  | 'UNKNOWN';

const pokerGames: PokerGame[] = [
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

const _earnGames: Record<PokerGame, number> = {
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
};

const _wonGames: Record<PokerGame, number> = {
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
};

const txtContentByGame: Record<PokerGame, string[][]> = {
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

let rake = 0;
let playedHands = 0;

const readAllCashGameEarnings = (folderPath: string) => {
  fs.readdirSync(folderPath)
    .filter((filename) => filename.endsWith('.txt'))
    .forEach((filename) => parseFileText(path.join(folderPath, filename)));
};

const parseFileText = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const linebreak = '\r\n';

  const lines = content.split(linebreak);

  const inputLines = lines.filter(
    (line) => isLineHeader(line) || isLineKeywordAndPlayer(line)
  );

  const headerAndSummary: Record<string, string[]> = {};
  let currentHand: string[] = [];
  let currentHeader = '';

  for (const line of inputLines) {
    if (line.startsWith('PokerStars Hand #')) {
      if (currentHand.length > 0) {
        headerAndSummary[currentHeader.trim()] = [...currentHand];
        currentHand = [];
      }
      // Set the current header
      currentHeader = line;
    } else {
      // Include all lines for the current hand
      currentHand.push(line);
    }
  }

  if (currentHand.length > 0) {
    const test = currentHeader.includes(POKERSTARTS_HEADER);
    if (!test) console.log(currentHeader);
    headerAndSummary[currentHeader.trim()] = [...currentHand];
  }

  calculateEarningsFromParsedText(headerAndSummary);
};

const calculateEarningsFromParsedText = (records: Record<string, string[]>) => {
  Object.entries(records).forEach(([key, value]) => {
    const matchedGame = pokerGames.find((game) => key.includes(game));

    if (!matchedGame) {
 /*      console.log('unknown', value); */
      _wonGames.UNKNOWN++;
      return;
    }

    const isWin = (lines: string[]): number | null => {
      const collectedLines = lines.filter((line) => line.includes('collected'));

      if (!collectedLines.length) return null;

      return collectedLines
        .filter((line) => line.includes(`${ENV.playerName} collected`))
        .map((line) => Number(line.split(' ')[2]))
        .reduce((acc, curr) => acc + curr, 0);
    };

    const winSum = isWin(value);
    if (!winSum) return;

    _earnGames[matchedGame] += winSum;
    _wonGames[matchedGame]++;
  });

  logData();
};

readAllCashGameEarnings(ENV.handHistoryFolderPath);

function logData() {
  /*   console.log('_wonGames', _wonGames);
  console.log('_earnGames', _earnGames); */
}

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
    line.includes(ENV.playerName)
  );
}

function isLineHeader(line: string): boolean {
  return ['*** SUMMARY ***', 'PokerStars Hand #'].some((word) =>
    line.includes(word)
  );
}
