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

const readAllHandHistoryFiles = (folderPath: string): PlayedHands => {
  const filePathList = FileHandler.getFilePathsFromFolder(folderPath);
  const handLinesEachFile = filePathList.map(getHandLinesFromFile);
  const playedHandsRecordEachFileList =
    handLinesEachFile.map(calculatePlayedHands);

  return combineFileRecordsToSummary(playedHandsRecordEachFileList);
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

const combineFileRecordsToSummary = (records: PlayedHands[]): PlayedHands => {
  // Sum all records as one
  const sumRecords = records.reduce((result, record) => {
    Object.keys(record).forEach((key) => {
      result[key as PokerGame | 'UNKNOWN'] =
        (result[key as PokerGame | 'UNKNOWN'] || 0) +
        record[key as PokerGame | 'UNKNOWN'];
    });
    return result;
  }, createPlayedHandsObject());

  const sortGamesDescByCount = Object.fromEntries(
    Object.entries(sumRecords).sort(([, a], [, b]) => b - a)
  ) as PlayedHands;

  return sortGamesDescByCount;
};

const calcAllPlayedHands = (stats: PlayedHands): number =>
  Object.values(stats).reduce((sum, count) => sum + count, 0);

const logPlayedHands = (stats: PlayedHands) => {
  logger('--- Played hands by game ---', 'magenta');

  // Create logging strings
  const logStrings = Object.entries(stats)
    .filter(([_game, gameCount]) => gameCount !== 0)
    .map(([game, gameCount]) => {
      const spaces = ' '.repeat(findLongestGameName().length - game.length + 2);
      return `${game}${spaces}${gameCount}`;
    });

  logStrings.forEach((logString) => logger(logString));

  /** Calculate and format all played hands */
  const allPlayedHandsCount = calcAllPlayedHands(stats);
  const allPlayedHeader = 'All played hands';
  const headerSpaces = ' '.repeat(
    findLongestGameName().length - allPlayedHeader.length + 2
  );

  const allPlayedString = `\n${allPlayedHeader}${headerSpaces}${allPlayedHandsCount}`;
  logger(allPlayedString, 'cyan');

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
