import path from 'path';
import { EnvConfig } from './env';
import * as dotenv from 'dotenv';

// .env should be located on root folder
const setEnvConfig = () => {
  const dotEnvLocation = path.join(__dirname, '../../..', '.env');
  dotenv.config({ path: dotEnvLocation });
};

const getEnvFromFile = (): EnvConfig | null => {
  setEnvConfig();

  const { env } = process;

  const envs = {
    HAND_HISTORY_FOLDER_PATH: env['HAND_HISTORY_FOLDER_PATH'],
    TOURNAMENT_STATISTICS_FOLDER_PATH: env['TOURNAMENT_STATISTICS_FOLDER_PATH'],
    PLAYER_NAME: ['PLAYER_NAME']
  };

  return Object.values(envs).every((env) => typeof env === 'string')
    ? (envs as unknown as EnvConfig)
    : null;
};

export default getEnvFromFile;
