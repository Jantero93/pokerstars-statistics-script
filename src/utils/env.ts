import * as dotenv from 'dotenv';
import path from 'path';
import tryGetEnvVariablesAutomatically from './envGetter';
import logger from './logger';
import process from 'process';

export type EnvConfig = {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
};

const dotEnvLocation = path.join(__dirname, '../..', '.env');
dotenv.config({ path: dotEnvLocation });

const getEnvFromFile = (): EnvConfig | null => {
  const { env } = process;

  const envs = {
    HAND_HISTORY_FOLDER_PATH: env['HAND_HISTORY_FOLDER_PATH'],
    TOURNAMENT_STATISTICS_FOLDER_PATH: env['TOURNAMENT_STATISTICS_FOLDER_PATH'],
    PLAYER_NAME: env['PLAYER_NAME']
  };

  return Object.values(envs).every((env) => typeof env === 'string')
    ? (envs as EnvConfig)
    : null;
};

const getConfig = (): EnvConfig => {
  const envsFromFile = getEnvFromFile();

  if (envsFromFile) return envsFromFile;

  const envsGetAutomatically = tryGetEnvVariablesAutomatically();

  if (envsGetAutomatically === null) {
    logger("Couldn't get env values from file or automatically", 'red');
    logger('Please set .env in root folder and set needed values', 'red');
    throw new Error('Invalid environment variables');
  }

  return envsGetAutomatically;
};

const ENV = getConfig();
export default ENV;
