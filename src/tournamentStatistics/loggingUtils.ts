import logger, { ConsoleColor } from '../utils/logger';

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
  value: string | number,
  labelsData: Record<string, { value: string | number }>,
  color?: ConsoleColor
): void => {
  const labelSpacing = ' '.repeat(
    Math.max(0, getMaxLabelLength(labelsData) - label.length + 2)
  );
  return logger(label + labelSpacing + value, color);
};
