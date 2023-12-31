/**
 * All environment variables typed
 */
export type Env = SystemEnv & Localization & MinGamesShow;

/**
 * Environment variables mandatory for scripts working properly
 */
export type SystemEnv = {
  /**
   * Folder path where hand history files exists
   */
  HAND_HISTORY_FOLDER_PATH: string;
  /**
   * Folder path where tournament summary files exists
   */
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  /**
   * Player (account) name
   */
  PLAYER_NAME: string;
};

/**
 * Localization for numbers etc (Optional value, default value "en-US")
 */
type Localization = {
  /**
   * Localization for numbers (e.g. "fi-FI", "en-US", "de-DE", etc).
   * Default value "en-US"
   */
  LOCALIZATION: string;
};

/**
 * Minimun amount games has to be played to be displayed in statistics
 */
type MinGamesShow = {
  /**
   * Minimun amount to be played to be showed in statistics for each game.
   * Default value 1
   */
  MIN_GAMES_SHOW: number;
};
