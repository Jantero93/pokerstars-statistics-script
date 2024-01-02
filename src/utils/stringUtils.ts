import ENV from './env/main';

/**
 * If no localization env varaible, default value will be "en-US"
 * @param value Number to localize
 * @returns Number localized
 */
export const localizeNumber = (value: number): string =>
  value.toLocaleString(ENV.LOCALIZATION);
