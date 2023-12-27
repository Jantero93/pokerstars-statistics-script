import ENV from './env';
import logger from './utils/logger';
import FileHandler from './utils/filereader';
import {
  PokerGame,
  createPlayedHandsObject,
  createKnownGamesList
} from './types';

/**
 * Array of unrecognized hands
 */
const unknownHandsList: string[] = [];

const playedHands = createPlayedHandsObject();
const pokerGames = createKnownGamesList();

const readAllHandHistoryFiles = (folderPath: string): void =>
  FileHandler.getFilePathsFromFolder(folderPath).forEach((filepath) =>
    getHandLinesFromFile(filepath)
  );

const getHandLinesFromFile = (filePath: string): void => {
  const lines = FileHandler.getContentLinesFromFile(filePath);
  const headerText = 'PokerStars Hand #';
  const matchingLines = lines.filter((line) => line.includes(headerText));

  calculatePlayedHands(matchingLines);
};

const calculatePlayedHands = (handLineTexts: string[]): void =>
  handLineTexts.forEach((textLine) => {
    const matchedGame = pokerGames.find((game) => textLine.includes(game));

    if (!matchedGame) {
      playedHands.UNKNOWN++;
      // Push unknown hand and then print it later
      unknownHandsList.push(textLine);
      return;
    }

    playedHands[matchedGame]++;
  });

const sortGameDataDesc = (): string[] =>
  Object.keys(playedHands).sort(
    (a, b) =>
      playedHands[b as PokerGame | 'UNKNOWN'] -
      playedHands[a as PokerGame | 'UNKNOWN']
  );

const logPlayedHands = (): void => {
  const sortedGames = sortGameDataDesc();

  // Get max string length so played count can be aligned vertically
  const maxGameNameLength = sortedGames.reduce<number>(
    (max, game) => Math.max(max, game.length),
    0
  );

  logger('--- Played hands by game ---', 'magenta');

  sortedGames.forEach((game) => {
    const gameCount = playedHands[game as PokerGame | 'UNKNOWN'];

    // Log only played games
    if (gameCount === 0) return;

    const spaces = ' '.repeat(maxGameNameLength - game.length + 2); // Add 2 extra spaces
    logger(`${game}${spaces}${gameCount}`);
  });

  /** Calculate all played hands */
  const allPlayedHandsCount = Object.values(playedHands).reduce<number>(
    (sum, count) => sum + count,
    0
  );
  logger(`\nAll played hands${' '.repeat(9)}${allPlayedHandsCount}`, 'cyan');

  if (unknownHandsList.length || playedHands.UNKNOWN) {
    logger('\n***** THERE WERE UNKNOWN HANDS / GAMES *****', 'yellow');
    logger(unknownHandsList.join(', '), 'red');
  }
};

const executePlayHandHistory = () => {
  readAllHandHistoryFiles(ENV.handHistoryFolderPath);
  logPlayedHands();
};

export default executePlayHandHistory;
