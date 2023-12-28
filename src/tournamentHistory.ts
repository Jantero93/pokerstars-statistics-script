import ENV from './utils/env';
import logger, { ConsoleColor } from './utils/logger';
import FileHandler from './utils/filereader';
import { TournamentStats, createTournamentStatsObject } from './types';

const calcStatsFromFile = (filePath: string): TournamentStats => {
  const lines = FileHandler.getContentLinesFromFile(filePath);

  // Helper
  const calcWin = (): number => {
    const playerLine = lines
      .map((line) => line.trim())
      .find((line) => line.includes(ENV.PLAYER_NAME));

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

  return {
    wins: calcWin(),
    buyIns: calcBuyIn() + calcReEntriesSum(),
    tournamentWins: wonTournament() ? 1 : 0,
    tournamentCount: 1
  };
};

const calculateTotalStats = (statsList: TournamentStats[]): TournamentStats =>
  statsList.reduce(
    (acc, current) => ({
      wins: acc.wins + current.wins,
      buyIns: acc.buyIns + current.buyIns,
      tournamentWins: acc.tournamentWins + current.tournamentWins,
      tournamentCount: acc.tournamentCount + current.tournamentCount
    }),
    createTournamentStatsObject()
  );

const getTournamentStats = (folderPath: string): TournamentStats => {
  const tournamentStatsList = FileHandler.getFilePathsFromFolder(
    folderPath
  ).map((filepath) => calcStatsFromFile(filepath));

  const totalStats = calculateTotalStats(tournamentStatsList);

  return totalStats;
};

const logStatistics = (stats: TournamentStats) => {
  const { wins, buyIns, tournamentCount, tournamentWins } = stats;
  const winBuyInsDiff = wins - buyIns;
  const diffTextColor = winBuyInsDiff <= 0 ? 'red' : 'green';

  const labelSpacing = (label: string) =>
    ' '.repeat(Math.max(0, 30 - label.length));

  const spacingLog = (label: string, value: any, color?: ConsoleColor) => {
    logger(`${label}${labelSpacing(label)}${value}`, color);
  };

  logger('\n--- Tournament, sit & go statistics ---', 'magenta');
  spacingLog('Played tournaments', tournamentCount);
  spacingLog('Tournament, sit & go wins', tournamentWins);
  spacingLog('Earned money', wins);
  spacingLog('Paid buy-ins (and rebuys)', buyIns);
  spacingLog('Diff on buy-ins and winnings', winBuyInsDiff, diffTextColor);
};

const executeTournamentHistory = () => {
  const stats = getTournamentStats(ENV.TOURNAMENT_STATISTICS_FOLDER_PATH);
  logStatistics(stats);
};

export default executeTournamentHistory;
