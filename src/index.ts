import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

/**
 * Array of unrecognized hands
 */
const unknownHands: string[] = [];

type PokerGame =
  | "7 Card Stud Hi/Lo"
  | "7 Card Stud"
  | "Hold'em Limit"
  | "Hold'em No Limit"
  | "Omaha Hi/Lo Limit"
  | "Omaha Hi/Lo Pot Limit"
  | "Triple Draw 2-7 Lowball"
  | "Omaha Pot Limit"
  | "Razz";

const playedHands: Record<PokerGame | "UNKNOWN", number> = {
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

const readAllHandHistoryFiles = (folderPath: string) =>
  fs
    .readdirSync(folderPath)
    .filter((filename) => filename.endsWith(".txt"))
    .forEach((filename) =>
      getHandLinesFromFiles(path.join(folderPath, filename)),
    );

const getHandLinesFromFiles = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");
  const handPattern = /PokerStars Hand #\d+/g;

  const lines = content.split("\n");
  const matchingLines = lines.filter((line) => handPattern.test(line));
  calculatePlayedHands(matchingLines);
};

const calculatePlayedHands = (textLines: string[]) =>
  textLines.forEach((handTextLine) => {
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

    const matchedGame = pokerGames.find((game) => handTextLine.includes(game));

    if (!matchedGame) {
      playedHands.UNKNOWN++;
      unknownHands.push(handTextLine);
      return;
    }

    playedHands[matchedGame]++;
  });

const logPlayedHands = () => {
  // Sort bu played hands descending
  const sortedGames = Object.keys(playedHands).sort(
    (a, b) =>
      playedHands[b as PokerGame | "UNKNOWN"] -
      playedHands[a as PokerGame | "UNKNOWN"],
  );

  // Get max string length so played count can be aligned vertically
  const maxGameNameLength = sortedGames.reduce(
    (max, game) => Math.max(max, game.length),
    0,
  );

  sortedGames.forEach((game) => {
    const gameCount = playedHands[game as PokerGame | "UNKNOWN"];

    if (gameCount === 0) return;

    const spaces = " ".repeat(maxGameNameLength - game.length + 2); // Add 2 extra spaces
    console.log(`${game}${spaces}${gameCount}`);
  });

  const allCount = Object.values(playedHands).reduce(
    (sum, count) => sum + count,
    0,
  );
  console.log(`\nAll played hands         ${allCount}`);

  if (playedHands.UNKNOWN > 0) {
    printErrorIfUnknownGamesExists();
  }
};

/**
 * Set absolute path to PokerStar folder where hand history is stored
 */
readAllHandHistoryFiles(ENV.historyFolderPath);

logPlayedHands();

function printErrorIfUnknownGamesExists() {
  console.log(
    "\x1b[31m",
    "\n***** THERE WERE UNKNOWN GAMES *****\n",
    "\x1b[0m",
  );
  console.log(new Set(unknownHands));
}
