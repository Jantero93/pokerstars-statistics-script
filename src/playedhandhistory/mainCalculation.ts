import ENV from '../utils/env/main';
import logger from '../utils/logger';
import FileHandler from '../utils/filereader';
import {
  PokerGame,
  PokerGameRecord,
  createKnownGamesList,
  createPokerGamesNumberRecord,
  findLongestGameName
} from '../types/general';
import { localizeNumber } from '../utils/stringUtils';
import { calcAllHandsPlayed } from './calcUtils';
import { createLinebreak, createLoggingOutputPlayedHands } from './loggingUtils';
import { SPACE } from '../../globalConsts';

/**
 * Array of unrecognized hands
 */
const unknownHandsList: string[] = [];

/**
 * Entry point to run statistics of played hands by game
 */
const executePlayHandHistory = () => {
  const stats = readAllHandHistoryFiles(ENV.HAND_HISTORY_FOLDER_PATH);
  logPlayedHands(stats);
};

/**
 * @param folderPath Folder path where all hand history files exists
 * @returns Get all played hands by game
 */
const readAllHandHistoryFiles = (folderPath: string): PokerGameRecord => {
  const filePathList: string[] = FileHandler.getFilePathsFromFolder(folderPath);
  const handLinesEachFile: string[][] = filePathList.map(getHandLinesFromFile);

  const playedHandsRecordEachFile: PokerGameRecord[] =
    handLinesEachFile.map(calculatePlayedHands);

  const data = combineFileRecords(playedHandsRecordEachFile);
  return data;
};

/**
 * @param filePath File path where to read the content
 * @returns Array of lines. Redudant lines are filtered
 */
const getHandLinesFromFile = (filePath: string): string[] => {
  const headerText = 'PokerStars Hand #';

  const lines = FileHandler.getContentLinesFromFile(filePath);

  const headerLines = lines.filter((line) => line.includes(headerText));
  return headerLines;
};

/**
 * Get's played hands from one file
 * @param handLineTexts Array of text lines containing the information of played games
 * @returns Played games stats
 */
const calculatePlayedHands = (handLineTexts: string[]): PokerGameRecord => {
  const playedGamesRecord = createPokerGamesNumberRecord();
  const knownGames = createKnownGamesList();

  handLineTexts.forEach((textLine) => {
    const matchedGame = knownGames.find((game) => textLine.includes(game));

    if (!matchedGame) {
      playedGamesRecord.UNKNOWN++;
      // Push unknown hand and then print it later
      unknownHandsList.push(textLine);
      return;
    }

    playedGamesRecord[matchedGame]++;
  });

  return playedGamesRecord;
};

/**
 * Combines all records from all files. Sorts game by played hands descending
 * @param fileRecords All calculated played hand records from each file
 * @returns Full statistics
 */
const combineFileRecords = (
  fileRecords: PokerGameRecord[]
): PokerGameRecord => {
  // Sum all file records as one
  const singleRecord = fileRecords.reduce((result, record) => {
    Object.keys(record).forEach((key) => {
      result[key as PokerGame] =
        (result[key as PokerGame] || 0) + record[key as PokerGame];
    });
    return result;
  }, createPokerGamesNumberRecord());

  const sortGamesDescByCount = Object.fromEntries(
    Object.entries(singleRecord).sort(([, a], [, b]) => b - a)
  ) as PokerGameRecord;

  return sortGamesDescByCount;
};

/**
 * Generally logs played hands and other information
 * @param stats Full played hand statistics
 */
const logPlayedHands = (stats: PokerGameRecord) => {
  const allPlayedHandsCount = calcAllHandsPlayed(stats);

  /** Create logging strings by each game */
  const logStrings = createLoggingOutputPlayedHands(stats);
  /** Create linebreak based on longest output string */
  const linebreak = createLinebreak(logStrings);

  /** Get total sum of played hands strings */
  const allPlayedHeader = 'All played hands';
  const headerSpaces = SPACE.repeat(
    findLongestGameName().length - allPlayedHeader.length + 2
  );
  const allPlayedString = `${allPlayedHeader}${headerSpaces}${localizeNumber(
    allPlayedHandsCount
  )}`;

  /** Log everything */
  logger('--- Played hands by game ---', 'magenta');
  logStrings.forEach((logString) => logger(logString));
  logger(linebreak);
  logger(allPlayedString, 'cyan');

  if (unknownHandsList.length || stats.UNKNOWN) {
    logger('\n***** THERE WERE UNKNOWN HANDS / GAMES *****', 'yellow');
    logger(unknownHandsList.join(', '), 'red');
  }
};

export default executePlayHandHistory;
