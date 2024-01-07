import ENV from '../utils/env/main';
import logger from '../utils/logger';
import FileHandler from '../utils/filereader';
import {
  LoggingOutput,
  TournamentStats,
  createTournamentStatsObject
} from '../types/tournament';
import { getLongestLogStringCount, logWithSpacing } from './loggingUtils';
import {
  calcWinSum,
  calcBuyIn,
  calcReEntriesSum,
  calcTournamentWinPercentage,
  calcEarningComparedToCosts,
  didWinTournament
} from './calcUtils';
import { localizeNumber } from '../utils/stringUtils';

/**
 * Main entry point for executing tournament statistics
 */
const executeTournamentHistory = () => {
  const stats = getTournamentStats(ENV.TOURNAMENT_STATISTICS_FOLDER_PATH);
  logStatistics(stats);
};

/**
 * Gets and calculates all tournament statistics
 * @param folderPath Folder path where all tournament statistics files exist
 * @returns Full tournament statistics
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
 * @param filePath Absolute file path
 * @returns Tournament statistics for one file
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
 * Combines each file's tournament statistics as one record
 * @param recordList List of each file's tournament stats
 * @returns Full tournament statistics
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

  // Calculate summary stats
  const winBuyInsDiff = earnings - buyIns;

  const winPercentage = calcTournamentWinPercentage(stats);
  const winPercentageString = `${localizeNumber(winPercentage, 2)} %`;

  const earningsComparedCosts = calcEarningComparedToCosts(buyIns, earnings);
  const earningsComparePercentage = `${localizeNumber(
    earningsComparedCosts,
    2
  )} %`;

  const labelsData: LoggingOutput = {
    'Total games': { value: localizeNumber(tournamentCount) },
    'Total wins': { value: localizeNumber(tournamentWins) },
    'Winning percentage': { value: winPercentageString },
    'Earned money': { value: localizeNumber(earnings) },
    'Paid buy-ins (and rebuys)': { value: localizeNumber(buyIns) },
    'Diff on buy-ins and winnings': {
      value: localizeNumber(winBuyInsDiff),
      color: 'cyan'
    },
    'Earnings compared to costs': {
      value: earningsComparePercentage,
      color: 'cyan'
    }
  };

  logger('\n--- Tournament, sit & go statistics ---', 'magenta');

  Object.entries(labelsData).forEach(([header, { value, color }]) => {
    logWithSpacing(header, value, labelsData, color);

    // Add dashes after "Paid buy-ins (and rebuys)"
    if (header === 'Paid buy-ins (and rebuys)') {
      const dashes = '-'.repeat(getLongestLogStringCount(labelsData));
      logger(dashes);
    }
  });
};

export default executeTournamentHistory;
