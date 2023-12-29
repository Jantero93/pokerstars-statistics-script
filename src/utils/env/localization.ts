/**
 * Fist check .env file, then try to get from process.env.LANG
 * Fallback value is 'en_US'
 * @returns Gets localization, fallback value is 'en_US'
 */
export const getSystemLocalization = (): string => {
  //TODO: USE NPM PACKAGE TO GET LOCALIZATION
  const { env } = process;
  return (
    env['LOCALIZATION'] ??
    process.env.LANG?.split('.')[0].replace('_', '-') ??
    'en-US'
  );
};
