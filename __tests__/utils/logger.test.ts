import logger, { ConsoleColor, LogInput } from '../../src/utils/logger';
// Mock console.log to capture output
const mockConsoleLog = jest.spyOn(console, 'log');

beforeEach(() => {
  // Clear console.log mock between tests
  mockConsoleLog.mockClear();
});

describe('Custom logger tests', () => {
  it('Logs input without color', () => {
    const input: LogInput = 'Test message';
    logger(input);
    expect(mockConsoleLog).toHaveBeenCalledWith(input);
  });

  it('Logs input with color', () => {
    const input: LogInput = 'Colored message';
    const color: ConsoleColor = 'green';

    logger(input, color);
    expect(mockConsoleLog).toHaveBeenCalledWith(`\x1b[32m${input}\x1b[0m`);
  });

  it('Logs array input with color', () => {
    const input: LogInput = ['Array', 'message'];
    const color: ConsoleColor = 'blue';

    logger(input, color);
    const expectedOutput = expect.stringContaining('Array');
    expect(mockConsoleLog).toHaveBeenCalledWith(expectedOutput);
  });

  it('Logs number input with color', () => {
    const input: LogInput = 42;
    const color: ConsoleColor = 'cyan';

    logger(input, color);
    expect(mockConsoleLog).toHaveBeenCalledWith(`\x1b[36m${input}\x1b[0m`);
  });
});
