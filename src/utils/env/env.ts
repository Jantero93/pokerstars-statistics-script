import setEnvFileConfig from './envFileConfig';
import tryGetEnvVariablesAutomatically from './envGetterSystem';
import getEnvFromFile from './envGetterFile';
import getSystemLocalization from './localization';
import { getMinimunPlaysToShow } from './otherEnvGetters';

export type Env = SystemEnv & Localization & MinGamesShow;

export type SystemEnv = {
  HAND_HISTORY_FOLDER_PATH: string;
  TOURNAMENT_STATISTICS_FOLDER_PATH: string;
  PLAYER_NAME: string;
};

type Localization = {
  LOCALIZATION: string;
};

type MinGamesShow = {
  MIN_GAMES_SHOW: number;
};

/**
 * @returns Environment variables. First checks from .env
 * file and then try to detect from os
 */
const getEnv = (): Env => {
  setEnvFileConfig();

  const localizationLanguage = getSystemLocalization();

  const systemEnvsFile = getEnvFromFile();

  if (systemEnvsFile) {
    const allEnv = {
      ...systemEnvsFile,
      MIN_GAMES_SHOW: getMinimunPlaysToShow(),
      LOCALIZATION: localizationLanguage
    };

    return allEnv;
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

  return {
    ...envsGetAutomatically,
    MIN_GAMES_SHOW: getMinimunPlaysToShow(),
    LOCALIZATION: localizationLanguage
  };
};

const ENV = getEnv();
export default ENV;
