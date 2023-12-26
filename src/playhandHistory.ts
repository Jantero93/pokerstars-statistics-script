import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

/**
 * Array of unrecognized hands
 */
const unknownHandsList: string[] = [];

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
      getHandLinesFromFile(path.join(folderPath, filename)),
    );

const getHandLinesFromFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");
  const headerText = "PokerStars Hand #";

  const lines = content.split("\r\n");
  const matchingLines = lines.filter((line) => line.includes(headerText));

  calculatePlayedHands(matchingLines);
};

const calculatePlayedHands = (handLineTexts: string[]) =>
  handLineTexts.forEach((textLine) => {
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

    const matchedGame = pokerGames.find((game) => textLine.includes(game));

    if (!matchedGame) {
      playedHands.UNKNOWN++;
      // Push unknown hand and then print it later
      unknownHandsList.push(textLine);
      return;
    }

    playedHands[matchedGame]++;
  });

const logPlayedHands = () => {
  // Sort by played hands descending
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

  printHandStatsHeader();

  sortedGames.forEach((game) => {
    const gameCount = playedHands[game as PokerGame | "UNKNOWN"];

    // Log only played games
    if (gameCount === 0) return;

    const spaces = " ".repeat(maxGameNameLength - game.length + 2); // Add 2 extra spaces
    console.log(`${game}${spaces}${gameCount.toLocaleString("fi-Fi")}`);
  });

  const allCount = Object.values(playedHands).reduce(
    (sum, count) => sum + count,
    0,
  );

  const logSpaces = " ".repeat(9);
  console.log(
    `\x1b[96m\nAll played hands${logSpaces}${allCount.toLocaleString(
      "fi-Fi",
    )}\x1b[0m`,
  );

  if (unknownHandsList.length || playedHands.UNKNOWN) printErrorLog();
};

/**
 * Set absolute path to PokerStar folder where hand history is stored
 */
readAllHandHistoryFiles(ENV.handHistoryFolderPath);

logPlayedHands();

function printErrorLog() {
  console.log(
    "\x1b[33m", // Set text color to yellow
    "\n***** THERE WERE UNKNOWN HANDS / GAMES *****\n",
    "\x1b[0m", // Reset text color to default
  );
  console.log(
    "\x1b[31m", // Set text color to red
    unknownHandsList,
    "\x1b[0m", // Reset text color to default
  );
}

function printHandStatsHeader() {
  const message = "Playerd hands by game";
  console.log(`\x1b[35m${message}\x1b[0m`);
}
