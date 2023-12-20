import * as fs from "fs";
import * as path from "path";

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

type Game = (typeof games)[keyof typeof games];

const playedHands: Record<Game, number> = {
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
  const {
    holdEmLimit,
    holdEmNolimit,
    omahaHiLoLimit,
    omahaHiLoPotLimit,
    omahaPotLimit,
    razz,
    sevenCardStud,
    sevenCardStudHiLo,
    tripleDrawLowball,
  } = games;
  hands.forEach((hand) => {
    switch (true) {
      case hand.includes(sevenCardStudHiLo):
        playedHands["7 Card Stud Hi/Lo"]++;
        break;
      case hand.includes(sevenCardStud):
        playedHands["7 Card Stud"]++;
        break;
      case hand.includes(holdEmLimit):
        playedHands["Hold'em Limit"]++;
        break;
      case hand.includes(holdEmNolimit):
        playedHands["Hold'em No Limit"]++;
        break;
      case hand.includes(omahaHiLoLimit):
        playedHands["Omaha Hi/Lo Limit"]++;
        break;
      case hand.includes(omahaHiLoPotLimit):
        playedHands["Omaha Hi/Lo Pot Limit"]++;
        break;
      case hand.includes(tripleDrawLowball):
        playedHands["Triple Draw 2-7 Lowball"]++;
        break;
      case hand.includes(omahaPotLimit):
        playedHands["Omaha Pot Limit"]++;
        break;
      case hand.includes(razz):
        playedHands["Razz"]++;
        break;
      default:
        playedHands.UNKNOWN++;
    }
  });
};

const logHandsByGame = () => {
  console.log("\n");
  console.log("=============================");
  console.log("\n");

  const sortedGames = Object.keys(playedHands).sort(
    (a, b) => playedHands[b as Game] - playedHands[a as Game],
  );

  const maxGameNameLength = sortedGames.reduce(
    (max, game) => Math.max(max, game.length),
    0,
  );

  for (const game of sortedGames) {
    const gameCount = playedHands[game as Game];
    if (gameCount !== 0) {
      const spaces = " ".repeat(maxGameNameLength - game.length + 2); // Add 2 extra spaces
      console.log(`${game}${spaces}${gameCount}`);
    }
  }

  const allCount = Object.values(playedHands).reduce(
    (sum, count) => sum + count,
    0,
  );
  console.log(`\nAll played hands:        ${allCount}`);
  console.log("\n");
  console.log("=============================");

  if (playedHands.UNKNOWN > 0) {
    console.log(
      "\x1b[31m",
      "\n***** THERE WERE UNKNOWN GAMES *****\n",
      "\x1b[0m",
    );
  }
};

countHandsInFolder(
  "C:\\Users\\Janzk\\AppData\\Local\\PokerStars\\HandHistory\\jant999",
);

logHandsByGame();
