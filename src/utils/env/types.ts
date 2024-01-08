/**
 * @type {Env}
 * @property {string} HAND_HISTORY_FOLDER_PATH - The path to the hand history folder
 * @property {string} TOURNAMENT_STATISTICS_FOLDER_PATH - The path to the tournament statistics folder
 * @property {string} PLAYER_NAME - The name of the player/account
 * @property {string} LOCALIZATION - The localization setting (Optional, default: "en-US")
 * @property {number} MIN_GAMES_SHOW - The minimum number of games to be displayed in statistics (Optional, default: 1)
 * @property {number} EARNINGS_AMOUNT_SHOW - Show over +/- amounts in earnings (Optional, default 0)
 */
export type Env = SystemEnv & Localization & MinGamesShow & MinEarningsShow;

/**
 * Environment variables mandatory for scripts working properly
 */
export type SystemEnv = {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
};

/**
 * Localization for numbers etc (Optional value, default value "en-US")
 */
type Localization = {
  LOCALIZATION: string;
};

/**
 * Minimun amount games has to be played to be displayed in statistics
 */
type MinGamesShow = {
  MIN_GAMES_SHOW: number;
};

type MinEarningsShow = {
  EARNINGS_AMOUNT_SHOW: number;
};
