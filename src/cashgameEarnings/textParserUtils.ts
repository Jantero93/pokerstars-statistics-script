/**
 * Extract From raw file to hands to line arrays
 * @param lines - Raw lines from files
 * @returns Return array of arrays where each sub array is one hand history in string lines
 */
export const extractHandBlocksFromRaw = (lines: string[]): string[][] => {
  const handBlocks: string[][] = [];
  let currentBlock: string[] = [];

  lines.forEach((line) => {
    if (currentBlock.length > 0 && line.startsWith('PokerStars Hand #')) {
      handBlocks.push([...currentBlock]);
      currentBlock = [];
    }

    currentBlock.push(line);
  });

  if (currentBlock.length > 0) {
    handBlocks.push([...currentBlock]);
  }

  return handBlocks.map((block) => block.join('\n').split('\n'));
};
