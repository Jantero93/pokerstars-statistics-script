import ENV from './utils/env';
import logger from './utils/logger';
import FileHandler from './utils/filereader';
import {
  PokerGame,
  createPlayedHandsObject,
  createKnownGamesList,
  PlayedHands,
  findLongestGameName
} from './types';

/**
 * Array of unrecognized hands
 */
const unknownHandsList: string[] = [];

// Define the GameStats type

const readAllHandHistoryFiles = (folderPath: string): PlayedHands => {
  const filesContentLines = FileHandler.getFilePathsFromFolder(folderPath).map(
    (filepath) => getHandLinesFromFile(filepath)
  );

  const statsFromFiles = filesContentLines.map((fileLines) =>
    calculatePlayedHands(fileLines)
  );

  return finalizeRawData(statsFromFiles);
};

const getHandLinesFromFile = (filePath: string): string[] => {
  const lines = FileHandler.getContentLinesFromFile(filePath);
  const headerText = 'PokerStars Hand #';
  return lines.filter((line) => line.includes(headerText));
};

const calculatePlayedHands = (handLineTexts: string[]): PlayedHands => {
  const playdHandsStats = createPlayedHandsObject();
  const knownGames = createKnownGamesList();

  handLineTexts.forEach((textLine) => {
    const matchedGame = knownGames.find((game) => textLine.includes(game));

    if (!matchedGame) {
      playdHandsStats.UNKNOWN++;
      // Push unknown hand and then print it later
      unknownHandsList.push(textLine);
      return;
    }

    playdHandsStats[matchedGame]++;
  });

  return playdHandsStats;
};

const finalizeRawData = (records: PlayedHands[]): PlayedHands => {
  const sumRecords = records.reduce((result, record) => {
    Object.keys(record).forEach((key) => {
      result[key as PokerGame | 'UNKNOWN'] =
        (result[key as PokerGame | 'UNKNOWN'] || 0) +
        record[key as PokerGame | 'UNKNOWN'];
    });
    return result;
  }, {} as PlayedHands);

  const sortGamesDesc = Object.fromEntries(
    Object.entries(sumRecords).sort(([, a], [, b]) => b - a)
  ) as PlayedHands;

  return sortGamesDesc;
};

const logPlayedHands = (stats: PlayedHands) => {
  logger('--- Played hands by game ---', 'magenta');

  Object.entries(stats).forEach(([game, gameCount]) => {
    // Log only played games
    if (gameCount === 0) return;
    // Align on same level vertically
    const spaces = ' '.repeat(findLongestGameName().length - game.length + 2); // Add 2 extra spaces
    logger(`${game}${spaces}${gameCount}`);
  });

  /** Calculate and format all played hands */
  const allPlayedHandsCount = Object.values(stats).reduce<number>(
    (sum, count) => sum + count,
    0
  );

  const allPlayedHeader = 'All played hands';
  const headerSpaces = ' '.repeat(
    findLongestGameName().length - allPlayedHeader.length + 2
  );

  logger(`\n${allPlayedHeader}${headerSpaces}${allPlayedHandsCount}`, 'cyan');

  if (unknownHandsList.length || stats.UNKNOWN) {
    logger('\n***** THERE WERE UNKNOWN HANDS / GAMES *****', 'yellow');
    logger(unknownHandsList.join(', '), 'red');
  }
};

const executePlayHandHistory = () => {
  const stats = readAllHandHistoryFiles(ENV.HAND_HISTORY_FOLDER_PATH);
  logPlayedHands(stats);
};

export default executePlayHandHistory;
