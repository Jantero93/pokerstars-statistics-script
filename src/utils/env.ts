import * as dotenv from 'dotenv';
import path from 'path';
import tryGetEnvVariablesAutomatically from './envGetter';
import logger from './logger';

export type EnvConfig = {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
};

const dotEnvLocation = path.join(__dirname, '../..', '.env');
dotenv.config({ path: dotEnvLocation });

const getEnv = (key: string): string => process.env[key] ?? '';

const getEnvFromFile = (): EnvConfig => ({
  HAND_HISTORY_FOLDER_PATH: getEnv('HAND_HISTORY_FOLDER_PATH'),
  TOURNAMENT_STATISTICS_FOLDER_PATH: getEnv(
    'TOURNAMENT_STATISTICS_FOLDER_PATH'
  ),
  PLAYER_NAME: getEnv('PLAYER_NAME')
});

const getConfig = (): EnvConfig => {
  const envsFromFile = getEnvFromFile();
  const isValidFileEnvs = Object.values(envsFromFile).every(
    (env) => env !== ''
  );

  if (isValidFileEnvs) return envsFromFile;

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
