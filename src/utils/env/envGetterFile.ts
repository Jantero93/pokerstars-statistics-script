import { SystemEnv } from './env';

/**
 * Set config from .env file
 * @returns SystemConfig or null if any value is not set
 */
const getEnvFromFile = (): SystemEnv | null => {
  const { env } = process;

  const envs = {
    HAND_HISTORY_FOLDER_PATH: env['HAND_HISTORY_FOLDER_PATH'],
    TOURNAMENT_STATISTICS_FOLDER_PATH: env['TOURNAMENT_STATISTICS_FOLDER_PATH'],
    PLAYER_NAME: env['PLAYER_NAME']
  };

  return isSystemEnv(envs) ? envs : null;
};

const isSystemEnv = (envObj: any): envObj is SystemEnv =>
  Object.values(envObj).every((value) => value !== undefined);

export default getEnvFromFile;
