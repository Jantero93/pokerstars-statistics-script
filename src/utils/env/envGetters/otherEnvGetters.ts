import getUserLocale from 'get-user-locale';

/**
 * Gets MIN_GAMES_SHOW from .env file
 * @returns {number} Minimun amount of games to show in statistics. Default 1
 */
export const getMinimunPlaysToShowEnv = (): number =>
  Number(process.env['MIN_GAMES_SHOW']) || 1;

/**
 * First check .env file, then try to get from system
 *
 * Fallback value is 'en-US'
 * @returns {string} Gets localization, fallback value is 'en-US'
 */
export const getLocalizationEnv = (): string =>
  process.env['LOCALIZATION'] ??
  getUserLocale({
    useFallbackLocale: true,
    fallbackLocale: 'en-US'
  });
