import tryGetEnvVariablesAutomatically from './envGetterSystem';
import getEnvFromFile from './envGetterFile';

export interface EnvConfig {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
}

/**
 * @returns Environment variables. First checks from .env
 * file and then try to detect from os
 */
export const getEnv = (): EnvConfig => {
  const envsFromFile = getEnvFromFile();

  if (envsFromFile) {
    return envsFromFile;
  }

  const envsGetAutomatically = tryGetEnvVariablesAutomatically();

  if (envsGetAutomatically === null) {
    console.error("Couldn't get env values from file or automatically");
    console.error('Please set .env in root folder and set needed values');
    console.error('There is .env.example file for correct format');
    throw new Error(
      'Can not get environment values from system or environment'
    );
  }

  return envsGetAutomatically;
};

export const ENV = getEnv();
