/**
 * All environment variables typed
 */
export type Env = SystemEnv & Localization & MinGamesShow;

/**
 * Environment variables essential for scripts working properly
 */
export type SystemEnv = {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
};

/**
 * Localization for numbers etc
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
