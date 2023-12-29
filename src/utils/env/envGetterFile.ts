import path from 'path';
import { EnvConfig, getSystemLocalization } from './env';
import * as dotenv from 'dotenv';

// .env should be located on root folder
const setEnvConfig = () => {
  const dotEnvLocation = path.join(__dirname, '../../..', '.env');
  dotenv.config({ path: dotEnvLocation });
};

const getEnvFromFile = (): EnvConfig | null => {
  setEnvConfig();

  const { env } = process;

  const envs: EnvConfig = {
    HAND_HISTORY_FOLDER_PATH: env['HAND_HISTORY_FOLDER_PATH'] ?? '',
    TOURNAMENT_STATISTICS_FOLDER_PATH:
      env['TOURNAMENT_STATISTICS_FOLDER_PATH'] ?? '',
    PLAYER_NAME: env['PLAYER_NAME'] ?? '',
    LOCALIZATION: getSystemLocalization()
  };

  return Object.values(envs).every((value) => value !== '')
    ? (envs as unknown as EnvConfig)
    : null;
};

export default getEnvFromFile;
