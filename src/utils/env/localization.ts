import getUserLocale from 'get-user-locale';

/**
 * Fist check .env file, then try to get from system
 * Fallback value is 'en-US'
 * @returns {string} Gets localization, fallback value is 'en-US'
 */
export const getSystemLocalization = (): string =>
  process.env['LOCALIZATION'] ?? getUserLocale() ?? 'en-US';

export default getSystemLocalization;
