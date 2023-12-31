import ENV from './utils/env/main';
import logger, { ConsoleColor, LogInput } from './utils/logger';
import FileHandler from './utils/filereader';
import {
  TournamentStats,
  createTournamentStatsObject
} from './types/tournament';

/**
 * Main entry point for executing tournament statistics
 */
const executeTournamentHistory = () => {
  const stats = getTournamentStats(ENV.TOURNAMENT_STATISTICS_FOLDER_PATH);
  logStatistics(stats);
};

/**
 * Gets and calculates all tournament statistics
 * @param folderPath Folder path where all tournament statistics files exists
 * @returns {TournamentStats} Full tournament statistics
 */
const getTournamentStats = (folderPath: string): TournamentStats => {
  const tournamentFilePaths: string[] =
    FileHandler.getFilePathsFromFolder(folderPath);

  const tournamentRawDataFileList: TournamentStats[] =
    tournamentFilePaths.map(calcStatsFromFile);

  return calculateTotalStats(tournamentRawDataFileList);
};

/**
 * Reads tournament statistics from a single file
 * @param filePath Absolute file path to
 * @returns {TournamentStats} Tournament statistics for one file
 */
const calcStatsFromFile = (filePath: string): TournamentStats => {
  const lines = FileHandler.getContentLinesFromFile(filePath);

  return {
    earnings: calcWinSum(lines),
    buyIns: calcBuyIn(lines) + calcReEntriesSum(lines),
    tournamentWins: didWinTournament(lines) ? 1 : 0,
    tournamentCount: 1
  };
};

/**
 * Combines each files tournament statistics as one record
 * @param recordList List of each file's tournament stats
 * @returns {TournamentStats} Full tournament statistics
 */
const calculateTotalStats = (recordList: TournamentStats[]): TournamentStats =>
  recordList.reduce(
    (acc, current) => ({
      earnings: acc.earnings + current.earnings,
      buyIns: acc.buyIns + current.buyIns,
      tournamentWins: acc.tournamentWins + current.tournamentWins,
      tournamentCount: acc.tournamentCount + current.tournamentCount,
      earnedPercentage: 0
    }),
    createTournamentStatsObject()
  );

/**
 * Calculates additional data and generally logs the results
 * @param stats Full tournament statistics
 */
const logStatistics = (stats: TournamentStats) => {
  const { earnings, buyIns, tournamentCount, tournamentWins } = stats;
  const winBuyInsDiff = earnings - buyIns;
  const winPercentageString = `${calcTournamentWinPercentage(stats).toFixed(
    2
  )} %`;
  const earningsComparedCosts = calcEarningComparedToCosts(buyIns, earnings);
  const earningComparedLogColor = getEarningLogColor(earningsComparedCosts);
  const earningsComparePercentage = `${earningsComparedCosts.toFixed(2)} %`;
  const diffTextColor = getEarningLogColor(winBuyInsDiff);

  const getMaxLabelLength = () => {
    const labels = [
      'Total games',
      'Total wins',
      'Winning percentage',
      'Earned money',
      'Paid buy-ins (and rebuys)',
      'Diff on buy-ins and winnings',
      'Earnings compared to costs'
    ];

    return Math.max(...labels.map((label) => label.length));
  };

  /**
   * Log helper to align vertically numbers
   * @param label Header
   * @param value Number value
   * @param color Color output to terminal, optional.
   * Fallback value is default terminal color
   */
  const alignConsoleLog = (
    label: string,
    value: LogInput,
    color?: ConsoleColor
  ) => {
    const labelSpacing = ' '.repeat(
      Math.max(0, getMaxLabelLength() - label.length + 2)
    );
    logger(`${label}${labelSpacing}${value}`, color);
  };

  logger('\n--- Tournament, sit & go statistics ---', 'magenta');
  alignConsoleLog('Total games', tournamentCount);
  alignConsoleLog('Total wins', tournamentWins);
  alignConsoleLog('Winning percentage', winPercentageString);
  alignConsoleLog('Earned money', earnings);
  alignConsoleLog('Paid buy-ins (and rebuys)', buyIns);
  alignConsoleLog('Diff on buy-ins and winnings', winBuyInsDiff, diffTextColor);
  alignConsoleLog(
    'Earnings compared to costs',
    earningsComparePercentage,
    earningComparedLogColor
  );
};

/**
 * Calculate helpers for each tournament file stats
 */
const calcWinSum = (lines: string[]): number => {
  const playerLine = lines
    .map((line) => line.trim())
    .find((line) => line.includes(ENV.PLAYER_NAME));

  const parts = playerLine?.split(' ');
  if (!parts || parts.length < 4) return 0;

  const win = Number(parts[3].split(',').join(''));

  return Number.isNaN(win) ? 0 : win;
};

const calcBuyIn = (lines: string[]): number => {
  const buyInRaw = lines.find((line) => line.includes('Buy-In'))?.split(':')[1];

  if (!buyInRaw) {
    throw new Error('Could not find buy-in for tournament');
  }

  const [buyIn, rake] = buyInRaw.split('/').map(Number);
  return buyIn + rake;
};

const calcReEntriesSum = (lines: string[]): number => {
  const reEntryLine = lines.find((line) => line.includes('re-entries'));
  if (!reEntryLine) return 0;

  return Number(reEntryLine.split(' ')[8].split(',').join(''));
};

const didWinTournament = (lines: string[]) =>
  lines.some((line) => line.includes('You finished in 1st place'));

/**
 * Additional helpers
 */
const calcTournamentWinPercentage = (stats: TournamentStats): number => {
  const { tournamentCount, tournamentWins } = stats;

  if (tournamentCount === 0 || tournamentWins === 0) {
    return 0;
  }

  return (tournamentWins / tournamentCount) * 100;
};

const calcEarningComparedToCosts = (
  costs: number,
  earnings: number
): number => {
  if (costs === 0) return 0;

  return ((earnings - costs) / costs) * 100;
};

/**
 * @param value Number input
 * @returns "red" if value is under 0, otherwise "green"
 */
const getEarningLogColor = (value: number): 'red' | 'green' =>
  value < 0 ? 'red' : 'green';

export default executeTournamentHistory;
