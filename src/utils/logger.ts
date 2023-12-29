import { getSystemLocalization } from './env/localization';

export type ConsoleColor =
  | 'reset'
  | 'bright'
  | 'dim'
  | 'underscore'
  | 'blink'
  | 'reverse'
  | 'hidden'
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white';

type LogInputTypes = string | Array<unknown> | number;

const colorCodes: Record<ConsoleColor, number> = {
  reset: 0,
  bright: 1,
  dim: 2,
  underscore: 4,
  blink: 5,
  reverse: 7,
  hidden: 8,
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37
};

// Get localization of environment
const localization = getSystemLocalization();

const localizeNumberToString = (value: number) =>
  value.toLocaleString(localization);

/**
 * Checks input contains integer
 * @param input String variable
 * @returns True if contains integer
 */
const inputContainsNumber = (input: string) => /\d/.test(input);

/**
 * Localizes number in string input. Number may be integer or decimal.
 * @param input String input
 * @returns String as it is but number localised
 * @example (fi-FI) 'The number is 2000.35' --> 'The number is 2 000,35'
 */
const localizeStringWithNumber = (input: string) =>
  input.replace(/(\d+(\.\d+)?)/g, (match) =>
    Number(match).toLocaleString(localization)
  );

/**
 * Custom logger. Colors works at least on bash, powershell, cmd
 *
 * Under hood uses native console.log
 * @param input String, number, array
 * @param color Color of console input
 */
const logger = (input: LogInputTypes, color?: ConsoleColor) => {
  if (typeof input === 'string' && inputContainsNumber(input)) {
    input = localizeStringWithNumber(input);
  }

  if (typeof input === 'number') {
    input = localizeNumberToString(input);
  }

  if (!color) {
    console.log(input);
    return;
  }

  console.log(`\x1b[${colorCodes[color]}m${input}\x1b[0m`);
};

export default logger;
