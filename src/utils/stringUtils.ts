import ENV from './env/main';

/**
 * @param value Value to localize
 * @param fixed Precision, decimal count
 * @returns Number localized based on ENV variable, default "en-US"
 */
export const localizeNumber = (value: number, fixed?: number): string => {
  if (!fixed) {
    return value.toLocaleString(ENV.LOCALIZATION);
  }

  const fixedNumString = Number(value.toFixed(fixed));

  if (Number.isNaN(fixedNumString)) {
    throw new Error(`Invalid number localization, value: ${value}`);
  }

  return Number(fixedNumString).toLocaleString(ENV.LOCALIZATION);
};
