/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

type LosingTerm = "folded" | "lost" | "mucked";
type WinningTerm = "collected" | "won";

const SUMMARY_HEADER = "*** SUMMARY ***";

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
    .forEach((filename) =>
      calculateEarningsOnFile(path.join(folderPath, filename)),
    );
};

const calculateEarningsOnFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");

  /**
   * Contains map where key is id and content is whole text content of hand
   */
  const lines = content.split("\r\n").filter((line) => line.length);

  const handMap: Record<string, string[]> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("PokerStars Hand #")) {
      const handNumber = line.trim();
      const summaryLines: string[] = [];

      // Find lines between "*** SUMMARY ***" and the next "PokerStars Hand #"
      for (let j = i + 1; j < lines.length; j++) {
        const summaryLine = lines[j].trim();
        if (summaryLine === "*** SUMMARY ***") {
          break;
        }
        summaryLines.push(summaryLine);
      }

      handMap[handNumber] = summaryLines;
    }
  }

  console.log("handMap", handMap);

  //  parseHandTextContent(pokerHandMap);
};

const parseHandTextContent = (handMap: Record<string, string[]>) => {
  console.log("handMap", handMap);

  // calculateEarningFromParsedData(parsedData);
};

const calculateEarningFromParsedData = (
  pokerHand: Record<PokerGame, string[]>,
) => {};

const logResult = () => {};

readAllCashGameEarnings(ENV.handHistoryFolderPath);
logResult();

// Helpers
function extractWonAmountFromLine(line: string) {
  const regex = /\((\d+)\)/;
  const match = regex.exec(line);

  if (!match) {
    throw new Error("Error regex fail");
  }

  return parseInt(match[1], 10);
}

function findWinningLine(lines: string[]) {
  const playerName = ENV.playerName;
  const winTerms = ["collected", "won"] as const;

  const winningLine = lines.filter(
    (line) =>
      (line.includes(winTerms[0]) || line.includes(winTerms[1])) &&
      line.includes(playerName),
  );

  return winningLine[0];
}
