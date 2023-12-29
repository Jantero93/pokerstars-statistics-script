import path from 'path';
import { EnvConfig } from './env';
import * as dotenv from 'dotenv';

// .env should be located on root folder
const setEnvFileConfig = () => {
  const dotEnvLocation = path.join(__dirname, '../../..', '.env');
  dotenv.config({ path: dotEnvLocation });
};

/**
 * Set config related .env file and try to get values
 * @returns EnvConfig or null is one needed value is not set
 */
const getEnvFromFile = (): EnvConfig | null => {
  setEnvFileConfig();

  const { env } = process;

  const envs: EnvConfig = {
    HAND_HISTORY_FOLDER_PATH: env['HAND_HISTORY_FOLDER_PATH'] ?? '',
    TOURNAMENT_STATISTICS_FOLDER_PATH:
      env['TOURNAMENT_STATISTICS_FOLDER_PATH'] ?? '',
    PLAYER_NAME: env['PLAYER_NAME'] ?? ''
  };

  return Object.values(envs).every((value) => value !== '')
    ? (envs as unknown as EnvConfig)
    : null;
};

export default getEnvFromFile;
