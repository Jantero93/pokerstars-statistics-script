import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

/**
 * Array of unrecognized hands
 */
const unknownHands: string[] = [];

const games = {
  sevenCardStud: "7 Card Stud",
  sevenCardStudHiLo: "7 Card Stud Hi/Lo",
  razz: "Razz",
  tripleDrawLowball: "Triple Draw 2-7 Lowball",
  holdEmNolimit: "Hold'em No Limit",
  holdEmLimit: "Hold'em Limit",
  omahaHiLoLimit: "Omaha Hi/Lo Limit",
  omahaPotLimit: "Omaha Pot Limit",
  omahaHiLoPotLimit: "Omaha Hi/Lo Pot Limit",
  UNKNOWN: "UNKNOWN",
} as const;

const playedHands: Record<string, number> = {
  "7 Card Stud": 0,
  "7 Card Stud Hi/Lo": 0,
  Razz: 0,
  "Triple Draw 2-7 Lowball": 0,
  "Hold'em No Limit": 0,
  "Hold'em Limit": 0,
  "Omaha Hi/Lo Limit": 0,
  "Omaha Pot Limit": 0,
  "Omaha Hi/Lo Pot Limit": 0,
  UNKNOWN: 0,
};

const countHandsInFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");
  const handPattern = /PokerStars Hand #\d+/g;

  const lines = content.split("\n");
  const matchingLines = lines.filter((line) => handPattern.test(line));
  addPlayedHandToGameGroup(matchingLines);
};

const countHandsInFolder = (folderPath: string) =>
  fs
    .readdirSync(folderPath)
    .filter((filename) => filename.endsWith(".txt"))
    .forEach((filename) => countHandsInFile(path.join(folderPath, filename)));

const addPlayedHandToGameGroup = (hands: string[]) => {
  hands.forEach((hand) => {
    switch (true) {
      case hand.includes(games.sevenCardStudHiLo):
        playedHands["7 Card Stud Hi/Lo"]++;
        break;
      case hand.includes(games.sevenCardStud):
        playedHands["7 Card Stud"]++;
        break;
      case hand.includes(games.holdEmLimit):
        playedHands["Hold'em Limit"]++;
        break;
      case hand.includes(games.holdEmNolimit):
        playedHands["Hold'em No Limit"]++;
        break;
      case hand.includes(games.omahaHiLoLimit):
        playedHands["Omaha Hi/Lo Limit"]++;
        break;
      case hand.includes(games.omahaHiLoPotLimit):
        playedHands["Omaha Hi/Lo Pot Limit"]++;
        break;
      case hand.includes(games.tripleDrawLowball):
        playedHands["Triple Draw 2-7 Lowball"]++;
        break;
      case hand.includes(games.omahaPotLimit):
        playedHands["Omaha Pot Limit"]++;
        break;
      case hand.includes(games.razz):
        playedHands["Razz"]++;
        break;
      default:
        playedHands.UNKNOWN++;
        unknownHands.push(hand);
    }
  });
};

const logHandsByGame = () => {
  const sortedGames = Object.keys(playedHands).sort(
    (a, b) => playedHands[b] - playedHands[a],
  );

  const maxGameNameLength = sortedGames.reduce(
    (max, game) => Math.max(max, game.length),
    0,
  );

  sortedGames.forEach((game) => {
    const gameCount = playedHands[game];

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
 * Set absolute path to PokerStar folder where is hand history stored
 */
countHandsInFolder(ENV.historyFolderPath);

logHandsByGame();

function printErrorIfUnknownGamesExists() {
  console.log(
    "\x1b[31m",
    "\n***** THERE WERE UNKNOWN GAMES *****\n",
    "\x1b[0m",
  );
  console.log(new Set(unknownHands));
}
