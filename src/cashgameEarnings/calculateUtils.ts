import { SPACE } from '../../globalConsts';
import { ActionKeyword } from './types';

export const getCallsFromLines = (lines: string[]): number => {
  const callLines = lines.filter((line) => line.includes(ActionKeyword.calls));

  if (callLines.length === 0) return 0;

  return callLines.reduce<number>((sum, line) => {
    const wordList = line.split(SPACE);

    const callsTextIndex = wordList.indexOf(ActionKeyword.calls);
    const amountString = wordList.at(callsTextIndex + 1);
    const numberValue = Number(amountString);

    if (!numberValue) {
      error("Invalid call number, can't be hardcoded", line);
    }

    return sum + numberValue;
  }, 0);
};

export const getPostsFromLines = (lines: string[]): number => {
  const postLines = lines.filter((line) => line.includes(ActionKeyword.posts));

  if (postLines.length === 0) return 0;

  return postLines.reduce<number>((sum, line) => {
    const wordList = line.split(SPACE);

    // Special case, posts big & small blind at the same time
    if (wordList.length === 7) {
      const amount = wordList.at(-1);
      const smallAndBigBlind = Number(amount);

      if (Number.isNaN(smallAndBigBlind)) {
        error('Invalid small and big blind together', smallAndBigBlind);
      }

      return sum + smallAndBigBlind;
    }

    const postsTextIndex = wordList.indexOf(ActionKeyword.posts);
    const amountString = wordList.at(postsTextIndex + 3) ?? 0;

    const numberValue = Number(amountString);

    if (Number.isNaN(numberValue)) {
      error("Invalid post number, can't be hardcoded", numberValue);
    }

    return sum + numberValue;
  }, 0);
};

export const getCollectedFromLines = (lines: string[]): number => {
  const collectedLines = lines.filter((line) =>
    line.includes(ActionKeyword.collected)
  );

  if (collectedLines.length === 0) return 0;

  return collectedLines.reduce<number>((sum, line) => {
    const [_player, _collectedText, amount] = line.split(SPACE);

    const numberValue = Number(amount);

    if (Number.isNaN(numberValue)) {
      error("Collected indexes can't be hard coded, not valid number", line);
    }

    return sum + numberValue;
  }, 0);
};

export const getBetsFromLines = (lines: string[]): number => {
  const betLines = lines.filter((line) => line.includes(ActionKeyword.bets));

  if (betLines.length === 0) return 0;

  return betLines.reduce<number>((sum, line) => {
    const [_player, _betText, amount] = line.split(SPACE);

    const numberValue = Number(amount);

    if (Number.isNaN(numberValue)) {
      error("Bet indexes can't be hardcoded", line);
    }

    return sum + numberValue;
  }, 0);
};

export const getReturnedBet = (lines: string[]): number => {
  const betLine = lines.filter((line) =>
    line.includes(ActionKeyword['Uncalled bet'])
  );

  if (betLine.length === 0) return 0;

  if (betLine.length > 1) {
    error('Multiple Uncalled bet lines', betLine);
  }

  const [_uncalled, _bet, amount] = betLine.at(0)?.split(SPACE) ?? [];

  // Returned bet amount is in parentheses e.g. (12000)
  const numberWithoutParenthesis = amount.slice(1, -1);
  const numberValue = Number(numberWithoutParenthesis);

  if (Number.isNaN(numberValue)) {
    error("Uncalled bet index can't be hardcoded or invalid value", betLine);
  }

  return numberValue;
};

export const getRaisesFromLines = (lines: string[]): number => {
  const raisesLines = lines.filter((line) =>
    line.includes(ActionKeyword.raises)
  );

  if (raisesLines.length === 0) return 0;

  return raisesLines.reduce<number>((sum, line) => {
    const [_player, _raisesText, start, _to, end] = line.split(SPACE);

    if (!start || !end) {
      error("Raises indexes can't be hardcoded", line);
    }

    const startValue = Number(start);
    const endValue = Number(end);

    if (Number.isNaN(startValue) || Number.isNaN(endValue)) {
      error('Invalid number values on raises', line);
    }

    // Only diff matters because start vakue is included in bet or previous raise
    const diff = endValue - startValue;

    return sum + diff;
  }, 0);
};

const error = (msg: string, object?: unknown) => {
  if (!object) throw new Error(msg);

  throw new Error(`${msg}:\n${JSON.stringify(object)}`);
};
