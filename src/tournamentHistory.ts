import ENV from './env';
import logger from './utils/logger';
import FileHandler from './utils/filereader';
import { createTournamentStatsObject } from './types';

const tournamentStats = createTournamentStatsObject();

const readAllTournamentStatistics = (folderPath: string): void =>
  FileHandler.getFilePathsFromFolder(folderPath).forEach((filepath) =>
    getStatisticsFromFile(filepath)
  );

const getStatisticsFromFile = (filePath: string): void => {
  const lines = FileHandler.getContentLinesFromFile(filePath);

  // Helper
  const calcWin = (): number => {
    const playerLine = lines
      .map((line) => line.trim())
      .find((line) => line.includes(ENV.playerName));

    const parts = playerLine?.split(' ');
    if (!parts || parts.length < 4) return 0;

    const win = Number(parts[3].split(',').join(''));

    return Number.isNaN(win) ? 0 : win;
  };

  // Helper
  const calcBuyIn = (): number => {
    const lineBuyIn = lines
      .find((line) => line.includes('Buy-In'))
      ?.split(':')[1];

    if (!lineBuyIn) {
      throw new Error('Could not find buy-in for tournament');
    }

    const [buyIn, rake] = lineBuyIn.split('/').map(Number);
    return buyIn + rake;
  };

  // Helper
  const calcReEntriesSum = (): number => {
    const reEntryLine = lines.find((line) => line.includes('re-entries'));
    if (!reEntryLine) return 0;

    return Number(reEntryLine.split(' ')[8].split(',').join(''));
  };

  // Helper
  const wonTournament = (): boolean =>
    lines.some((line) => line.includes('You finished in 1st place'));

  tournamentStats.wins += calcWin();
  tournamentStats.buyIns += calcBuyIn() + calcReEntriesSum();
  tournamentStats.tournamentWins += wonTournament() ? 1 : 0;
  tournamentStats.tournamentCount++;
};

const logStatistics = (): void => {
  const { wins, buyIns, tournamentCount, tournamentWins } = tournamentStats;
  const winBuyInsDiff = wins - buyIns;
  const diffTextColor = winBuyInsDiff <= 0 ? 'red' : 'green';

  logger('\n--- Tournament, sit & go statistics ---', 'magenta');
  logger(`Played tournaments${' '.repeat(13)}${tournamentCount}`);
  logger(`Tournament, sit & go winnings  ${tournamentWins}`);
  logger(`Earned money${' '.repeat(19)}${wins}`);
  logger(`Paid buy-ins (and rebuyis)${' '.repeat(5)}${buyIns}`);
  logger(`Diff on buy-ins and winnings   ${winBuyInsDiff}`, diffTextColor);
};

const executeTournamentHistory = (): void => {
  readAllTournamentStatistics(ENV.tournamentStatisticsFolderPath);
  logStatistics();
};

export default executeTournamentHistory;
