import ENV from './utils/env/index';
import logger from './utils/logger';
import FileHandler from './utils/filereader';
import {
  PokerGame,
  PokerGameRecord,
  createKnownGamesList,
  createPokerGamesNumberRecord,
  findLongestGameName
} from './types/general';

/**
 * Array of unrecognized hands
 */
const unknownHandsList: string[] = [];

const executePlayHandHistory = () => {
  const stats = readAllHandHistoryFiles(ENV.HAND_HISTORY_FOLDER_PATH);
  logPlayedHands(stats);
};

const readAllHandHistoryFiles = (folderPath: string): PokerGameRecord => {
  const filePathList: string[] = FileHandler.getFilePathsFromFolder(folderPath);
  const handLinesEachFile: string[][] = filePathList.map(getHandLinesFromFile);

  const playedHandsRecordEachFile: PokerGameRecord[] =
    handLinesEachFile.map(calculatePlayedHands);

  const data = combineFileRecords(playedHandsRecordEachFile);
  return data;
};

const getHandLinesFromFile = (filePath: string): string[] => {
  const headerText = 'PokerStars Hand #';

  const lines = FileHandler.getContentLinesFromFile(filePath);

  const headerLines = lines.filter((line) => line.includes(headerText));
  return headerLines;
};

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

const combineFileRecords = (
  fileRecords: PokerGameRecord[]
): PokerGameRecord => {
  // Sum all file records as one
  const singleRecord = fileRecords.reduce((result, record) => {
    Object.keys(record).forEach((key) => {
      result[key as PokerGame | 'UNKNOWN'] =
        (result[key as PokerGame | 'UNKNOWN'] || 0) +
        record[key as PokerGame | 'UNKNOWN'];
    });
    return result;
  }, createPokerGamesNumberRecord());

  const sortGamesDescByCount = Object.fromEntries(
    Object.entries(singleRecord).sort(([, a], [, b]) => b - a)
  ) as PokerGameRecord;

  return sortGamesDescByCount;
};

const logPlayedHands = (stats: PokerGameRecord) => {
  const allPlayedHandsCount = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0
  );

  /** Create logging strings by each game */
  const logStrings = Object.entries(stats)
    .filter(([_game, gameCount]) => gameCount >= ENV.MIN_GAMES_SHOW)
    .map(([game, gameCount]) => {
      const spaces = ' '.repeat(findLongestGameName().length - game.length + 2);
      return `${game}${spaces}${gameCount}`;
    });

  /** linebreak */
  const character = '-';
  const longestLogStringLenght = logStrings.reduce(
    (maxLength, currentString) => Math.max(maxLength, currentString.length),
    0
  );
  const linebreak = character.repeat(longestLogStringLenght + character.length);

  /** Get total sum of played hands strings */
  const allPlayedHeader = 'All played hands';
  const headerSpaces = ' '.repeat(
    findLongestGameName().length - allPlayedHeader.length + 2
  );
  const allPlayedString = `${allPlayedHeader}${headerSpaces}${allPlayedHandsCount}`;

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
