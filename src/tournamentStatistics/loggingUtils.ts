import { SPACE } from '../../globalConsts';
import { LoggingOutput } from '../types/tournament';
import logger, { ConsoleColor } from '../utils/logger';

const SPACE_BETWEEN_LABEL_AND_VALUE = 2;

/**
 * @param labelsData Get's longest header length
 * @returns Length of header
 */
export const getMaxLabelLength = (
  labelsData: Record<string, { value: string | number }>
): number => {
  const labels = Object.keys(labelsData).map((label) => label.length);
  return Math.max(...labels);
};

/**
 * Log helper to align vertically numbers
 * @param label Header
 * @param value Number value
 * @param color Color output to the terminal, optional. Default value is the default terminal color
 */
export const logWithSpacing = (
  label: string,
  value: string,
  labelsData: LoggingOutput,
  color?: ConsoleColor
): void => {
  const labelSpacing = SPACE.repeat(
    getMaxLabelLength(labelsData) - label.length + SPACE_BETWEEN_LABEL_AND_VALUE
  );

  logger(label + labelSpacing + value, color);
};

/**
 * TODO: Not creating correct lenght of dashes in main function, maybe related to localization, now hard coded +2 for own need
 * @param logs Logging output
 * @returns Count of longest log string (value + header)
 */
export const getLongestLogStringCount = (logs: LoggingOutput): number =>
  Object.entries(logs).reduce(
    (longestString, [key, { value }]) =>
      Math.max(
        longestString,
        key.length + value.length + SPACE_BETWEEN_LABEL_AND_VALUE + 2
      ),
    0
  );
