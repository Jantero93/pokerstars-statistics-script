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

export type LogInput = string | Array<unknown> | number;

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

/**
 * Custom logger. Colors works at least on bash, powershell, cmd
 *
 * Under hood uses native console.log
 * @param input String, number, array
 * @param color Color of console input
 */
const logger = (input: LogInput, color?: ConsoleColor | undefined) => {
  if (!color) {
    console.log(input);
    return;
  }
  console.log(`\x1b[${colorCodes[color]}m${input}\x1b[0m`);
};

export default logger;
