import ENV from './env/main';

export const localizeNumber = (value: number): string =>
  value.toLocaleString(ENV.LOCALIZATION);

/**
 * Localizes number in string input. Number may be integer or decimal.
 * @param input String input
 * @returns String as it is but number localised
 * @example const localized = localizeStringWithNumber('The number is 2000.35')
 * console.log(localized) // "The number is 2 000,35" (fi-FI)
 */
export const localizeStringWithNumber = (input: string) =>
  input.replace(/(\d+(\.\d+)?)/g, (match) =>
    Number(match).toLocaleString(ENV.LOCALIZATION)
  );
