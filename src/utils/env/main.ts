import setEnvFileConfiguration from './envFileConfig';
import getEnvFromOs from './envGetters/envGetterOs';
import getEnvFromFile from './envGetters/envGetterFile';
import {
  getMinimunPlaysToShowEnv,
  getLocalizationEnv
} from './envGetters/otherEnvGetters';
import { Env } from './types';

/**
 * @returns {Env} Environment variables. First checks from .env
 * file and then try to detect from os
 * @throws If can not get environment
 * which are needed to execute statistics scripts
 */
const getEnv = (): Env => {
  setEnvFileConfiguration();

  // Get optional environment variables
  const localizationLanguage = getLocalizationEnv();
  const minAmountShowPlaysInStats = getMinimunPlaysToShowEnv();

  const systemEnvsFile = getEnvFromFile();

  if (systemEnvsFile) {
    const allEnv = {
      ...systemEnvsFile,
      MIN_GAMES_SHOW: minAmountShowPlaysInStats,
      LOCALIZATION: localizationLanguage
    };

    return allEnv;
  }

  const envsGetAutomatically = getEnvFromOs();

  if (envsGetAutomatically === null) {
    console.error("Couldn't get env values from file or automatically from os");
    console.error('Please set .env in root folder and set needed values');
    console.error('There is .env.example file for example');
    throw new Error(
      'Can not get environment values from system or environment'
    );
  }

  return {
    ...envsGetAutomatically,
    MIN_GAMES_SHOW: minAmountShowPlaysInStats,
    LOCALIZATION: localizationLanguage
  };
};

const ENV = getEnv();
export default ENV;
