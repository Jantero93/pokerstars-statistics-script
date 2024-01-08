import { POKERSTARS_HANDHISTORY_HEADER } from '../../globalConsts';
import { PokerGame, createKnownGamesList } from '../types/general';
import ENV from '../utils/env/main';
import { ParsedGameRawData, createKeywordList } from './types';

/**
 * Extract From raw file to hands to line arrays
 * @param lines - Raw lines from files
 * @returns Return array of arrays where each sub array is one hand history in string lines
 */
export const extractHandBlocksFromRaw = (lines: string[]): string[][] => {
  const handBlocks: string[][] = [];
  let currentBlock: string[] = [];
  let skipSummary = false;

  for (const line of lines) {
    if (line.startsWith('PokerStars Hand #')) {
      // Start a new block
      if (currentBlock.length > 0) {
        handBlocks.push([...currentBlock]);
        currentBlock = [];
        skipSummary = false; // Reset skipSummary for a new block
      }
    }

    if (line.startsWith('*** SUMMARY ***')) {
      skipSummary = true;
    }

    if (!skipSummary) {
      currentBlock.push(line);
    }
  }

  // Add the last block
  if (currentBlock.length > 0) {
    handBlocks.push([...currentBlock]);
  }

  return handBlocks;
};

export const convertRawBlockToKnownGame = (
  rawBlockLines: string[][]
): ParsedGameRawData[] => {
  const onlyCashGameHands = rawBlockLines.filter((handBlock) => {
    const header = handBlock.find((line) =>
      line.includes(POKERSTARS_HANDHISTORY_HEADER)
    );

    return !header?.includes('Tournament');
  });

  const mapped = onlyCashGameHands.map((handBlock) => {
    const headerLine = handBlock.find((line) =>
      line.includes(POKERSTARS_HANDHISTORY_HEADER)
    );

    if (!headerLine) {
      throw new Error(`Not found header line in raw lines:\n${rawBlockLines}`);
    }

    const pokerGames = createKnownGamesList();
    const matchedGame = pokerGames.find((game) => headerLine.includes(game));

    const playerLines = handBlock.filter((line) =>
      line.includes(ENV.PLAYER_NAME)
    );

    return [matchedGame ?? PokerGame.UNKNOWN, playerLines] as ParsedGameRawData;
  });

  return filterActionLines(mapped);
};

const filterActionLines = (
  parsedHands: ParsedGameRawData[]
): ParsedGameRawData[] => {
  const keywords = createKeywordList();

  const filteredActionLineHands = parsedHands.map(([game, lines]) => {
    const actionLines = lines.filter((line) =>
      keywords.some((keyword) => line.includes(keyword))
    );

    return [game, actionLines];
  });

  return filteredActionLineHands.filter(
    ([_game, lines]) => lines.length > 0
  ) as ParsedGameRawData[];
};
