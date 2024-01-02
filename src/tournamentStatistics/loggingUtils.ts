import logger, { ConsoleColor } from '../utils/logger';

/**
 * @param labelsData Get's longest header length
 * @returns Length of header
 */
export const getMaxLabelLength = (
  labelsData: Record<string, { value: string | number }>
): number => Math.max(...Object.keys(labelsData).map((label) => label.length));

/**
 * Get label spacing for aligning console log
 * @param label Label for which to calculate spacing
 * @returns Empty spacing depending on label length output so logging is vertically aligned
 */
export const getLabelSpacing = (
  label: string,
  labelsData: Record<string, { value: string | number }>
): string =>
  ' '.repeat(Math.max(0, getMaxLabelLength(labelsData) - label.length + 2));

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
) => logger(label + getLabelSpacing(label, labelsData) + value, color);
