import * as fs from 'fs';
import { extractHandBlocksFromRaw } from './textParserUtils';
import { ParsedGameRawData } from './types';
import {
  PokerGame,
  PokerGameRecord,
  createPokerGamesNumberRecord,
  findLongestGameName
} from '../types/general';
import * as CalcUtils from './calculateUtils';
import ENV from '../utils/env/main';
import Filereader from '../utils/filereader';
import logger from '../utils/logger';
import {
  createLinebreak,
  createLoggingOutputEarnings,
  createLoggingOutputPlayedHands
} from '../playedhandhistory/loggingUtils';
import { SPACE } from '../../globalConsts';
import { localizeNumber } from '../utils/stringUtils';

const executeCashGameEarnings = () => {
  const stats = readAllHandHistoryFiles(ENV.HAND_HISTORY_FOLDER_PATH);
  logEarnings(stats);
};

const readAllHandHistoryFiles = (path: string): PokerGameRecord => {
  const filePathList: string[] = Filereader.getFilePathsFromFolder(path);

  const fileContentList = filePathList.map((filePath) =>
    Filereader.getContentLinesFromFile(filePath)
  );

  const parsedContentFileList = fileContentList.map(extractHandBlocksFromRaw);
  const calcedEarningsFileList = parsedContentFileList.map(calculateEarnings);

  fs.writeFileSync('output.json', JSON.stringify(parsedContentFileList));

  const calcAllFilesSum = calculateEarningsFromFiles(calcedEarningsFileList);

  return calcAllFilesSum;
};

const calculateEarningsFromFiles = (
  fileRecords: PokerGameRecord[]
): PokerGameRecord => {
  // Sum all file records as one
  const singleRecord = fileRecords.reduce((result, record) => {
    Object.keys(record).forEach((key) => {
      result[key as PokerGame] =
        result[key as PokerGame] + record[key as PokerGame];
    });
    return result;
  }, createPokerGamesNumberRecord());

  const sortGamesDescByEarnings = Object.fromEntries(
    Object.entries(singleRecord).sort(([, a], [, b]) => b - a)
  ) as PokerGameRecord;

  return sortGamesDescByEarnings;
};

const calculateEarnings = (data: ParsedGameRawData[]): PokerGameRecord => {
  const stats = createPokerGamesNumberRecord();
  const {
    getCollectedFromLines,
    getReturnedBet,
    getCallsFromLines,
    getPostsFromLines,
    getBetsFromLines,
    getRaisesFromLines
  } = CalcUtils;

  data.forEach(([game, lines]) => {
    const collected = getCollectedFromLines(lines);
    const returnedBet = getReturnedBet(lines);
    const calls = getCallsFromLines(lines);
    const posts = getPostsFromLines(lines);
    const bets = getBetsFromLines(lines);
    const raises = getRaisesFromLines(lines);

    const wins = collected + returnedBet;
    const loses = calls + posts + bets + raises;

    const profit = wins - loses;

    stats[game] += profit;
  });

  return stats;
};

const calculateTotalProfit = (stats: PokerGameRecord): number =>
  Object.values(stats).reduce((sum, count) => sum + count, 0);

const logEarnings = (stats: PokerGameRecord) => {
  const totalProfit = calculateTotalProfit(stats);

  const logStrings = createLoggingOutputEarnings(stats);
  const linebreak = createLinebreak(logStrings);

  const totalProfitHeader = 'Total Profit';
  const headerSpaces = SPACE.repeat(
    findLongestGameName().length - totalProfitHeader.length + 2
  );
  const totalProfitLogOutput = `${totalProfitHeader}${headerSpaces}${localizeNumber(
    totalProfit
  )}`;

  // Log everything
  logger('\n--- Cashgame earnings ---', 'magenta');
  logStrings.forEach((logString) => logger(logString));
  logger(linebreak);
  logger(totalProfitLogOutput, 'cyan');
};

export default executeCashGameEarnings;
