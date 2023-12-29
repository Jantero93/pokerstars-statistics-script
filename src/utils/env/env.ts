import tryGetEnvVariablesAutomatically from './envGetterSystem';
import logger from '../logger';
import getEnvFromFile from './envGetterFile';

export interface EnvConfig {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
}

const getEnv = (): EnvConfig => {
  const envsFromFile = getEnvFromFile();

  if (envsFromFile) {
    return envsFromFile;
  }

  const envsGetAutomatically = tryGetEnvVariablesAutomatically();

  if (envsGetAutomatically === null) {
    logger("Couldn't get env values from file or automatically", 'red');
    logger('Please set .env in root folder and set needed values', 'red');
    logger('There is .env.example file for correct format', 'yellow');
    throw new Error(
      'Can not get environment values from system or environment'
    );
  }

  return envsGetAutomatically;
};

const ENV = getEnv();
export default ENV;
