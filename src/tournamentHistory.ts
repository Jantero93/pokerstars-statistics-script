import * as fs from "fs";
import * as path from "path";
import ENV from "./env";

let buyIns = 0;
let wins = 0;
let tournamentCount = 0;

const readAllTournamentStatistics = (folderPath: string) =>
  fs
    .readdirSync(folderPath)
    .filter((filtename) => filtename.endsWith(".txt"))
    .forEach((filename) =>
      getStatisticsFromFile(path.join(folderPath, filename)),
    );

const getStatisticsFromFile = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  const calcBuyIn = () => {
    const lineBuyIn = lines
      .find((line) => line.includes("Buy-In"))
      ?.split(":")[1];

    if (!lineBuyIn) {
      throw new Error("Could not find buy-in for tournament");
    }

    const [buyIn, rake] = lineBuyIn.split("/").map(Number);
    return buyIn + rake;
  };

  const calcWin = () => {
    const trimmedLines = lines.map((line) => line.trim());
    const playerLine = trimmedLines.find((line) =>
      line.includes(ENV.playerName),
    );

    const parts = playerLine?.split(" ");

    if (!parts || parts.length < 4) return 0;

    const win = Number(parts[3].split(",").join(""));

    return Number.isNaN(win) ? 0 : win;
  };

  const calcReEntriesSum = () => {
    const reEntryLine = lines.find((line) => line.includes("re-entries"));

    if (!reEntryLine) return 0;

    return Number(reEntryLine.split(" ")[8].split(",").join(""));
  };

  buyIns = buyIns + calcBuyIn() + calcReEntriesSum();
  tournamentCount++;
  wins = wins + calcWin();
};

const logStatistics = () => {
  const winBuyInsDiff = wins - buyIns;

  console.log("\n");
  logTournamentStaticsHeader();
  console.log(`Played tournaments${" ".repeat(12)}${tournamentCount}`);
  console.log(`Earned money${" ".repeat(18)}${wins.toLocaleString("fi-FI")}`);
  console.log(`Paid buy-ins (and rebuyis)${" ".repeat(4)}${buyIns.toLocaleString("fi-Fi")}`);
  printbuyInWinningDiff(winBuyInsDiff);
};

function logTournamentStaticsHeader() {
  const message = "Tournament, sit & go statistics";
  console.log(`\x1b[35m${message}\x1b[0m`);
}

function printbuyInWinningDiff(diff: number) {
  const diffColor =
    diff >= 0
      ? "\x1b[92m" // Green for positive numbers
      : "\x1b[31m"; // Red for negative numbers

  console.log(
    `Diff on buy-ins and winnings${" ".repeat(
      2,
    )}${diffColor}${diff.toLocaleString("fi-FI")}\x1b[0m`,
  );
}

readAllTournamentStatistics(ENV.tournamentStatisticsFolderPath);
logStatistics();
