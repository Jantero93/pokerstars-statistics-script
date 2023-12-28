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

const finLocalization = 'fi-Fi';

const localizeNumberToString = (value: number): string =>
  value.toLocaleString(finLocalization);

const inputContainsNumber = (input: string): boolean => /\d/.test(input);

const localizeStringWithNumber = (input: string): string =>
  input.replace(/(\d+)/g, (match) =>
    Number(match).toLocaleString(finLocalization)
  );

const logger = (input: LogInputTypes, color?: ConsoleColor): void => {
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
