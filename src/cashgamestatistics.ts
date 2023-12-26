/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

const SUMMARY_HEADER = "*** SUMMARY ***";
const POKERSTARTS_HEADER = "PokerStars Hand #";

type LosingTerm = "folded" | "lost" | "mucked";
type WinningTerm = "collected" | "won";
type ActionTerm = "bets" | "calls" | "raises" | "posts";
type Term = WinningTerm | LosingTerm | ActionTerm;

type SummaryHeader = typeof SUMMARY_HEADER;
type PokerStarsHeader = typeof POKERSTARTS_HEADER;

type PokerHeader = SummaryHeader | PokerStarsHeader;

type PokerGame =
  | "7 Card Stud Hi/Lo"
  | "7 Card Stud"
  | "Hold'em Limit"
  | "Hold'em No Limit"
  | "Omaha Hi/Lo Limit"
  | "Omaha Hi/Lo Pot Limit"
  | "Triple Draw 2-7 Lowball"
  | "Omaha Pot Limit"
  | "Razz"
  | "UNKNOWN";

const pokerGames: PokerGame[] = [
  "7 Card Stud Hi/Lo",
  "7 Card Stud",
  "Hold'em Limit",
  "Hold'em No Limit",
  "Omaha Hi/Lo Limit",
  "Omaha Hi/Lo Pot Limit",
  "Triple Draw 2-7 Lowball",
  "Omaha Pot Limit",
  "Razz",
];

const earningByGame: Record<PokerGame, number> = {
  "7 Card Stud Hi/Lo": 0,
  "7 Card Stud": 0,
  "Hold'em Limit": 0,
  "Hold'em No Limit": 0,
  "Omaha Hi/Lo Limit": 0,
  "Omaha Hi/Lo Pot Limit": 0,
  "Triple Draw 2-7 Lowball": 0,
  "Omaha Pot Limit": 0,
  Razz: 0,
  UNKNOWN: 0,
};

//let rake = 0;
//let playedHands = 0;

const readAllCashGameEarnings = (folderPath: string) => {
  fs.readdirSync(folderPath)
    .filter((filename) => filename.endsWith(".txt"))
    .forEach((filename) => parseFileText(path.join(folderPath, filename)));
};

const parseFileText = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");
  const linebreak = "\r\n";

  const lines = content.split(linebreak);

  const keywordLines = lines.filter(
    (line) => isLineHeader(line) || isLineKeywordAndPlayer(line),
  );

  let count = 0;
  const handCount = keywordLines.forEach(
    (line) => line.includes(POKERSTARTS_HEADER) && count++,
  );

  console.log('count', count)

  // const handsTxt = getHandRecords(keywordLines);
};

readAllCashGameEarnings(ENV.handHistoryFolderPath);

// Helper functions
function isLineKeywordAndPlayer(line: string) {
  const keywords: Term[] = [
    "collected",
    "folded",
    "lost",
    "mucked",
    "won",
    "raises",
    "bets",
    "calls",
  ];

  return (
    keywords.some((word) => line.includes(word)) &&
    line.includes(ENV.playerName)
  );
}

function isLineHeader(line: string): boolean {
  return ["*** SUMMARY ***", "PokerStars Hand #"].some((word) =>
    line.includes(word),
  );
}

function getHandRecords(keywordLines: string[]): Record<string, string[]> {
  throw new Error("");
}
