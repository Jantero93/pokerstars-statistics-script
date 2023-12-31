import ncp from 'ncp';
import * as fs from 'fs';
import * as path from 'path';

const sourcePath = './.env';
const destinationPath = './dist/.env';

/**
 * Checks is there .env file in project's root folder
 * @returns {boolean} True if .env file exists in root folder of project
 */
const checkEnvFileExists = () => {
  const filename = '.env';
  const currentModuleDir = path.dirname(new URL(import.meta.url).pathname);
  const filepath = path.join(`${currentModuleDir}/dist`, filename);

  let fileExists = false;

  fs.access(filepath, fs.constants.F_OK, (err) => (fileExists = !!err));

  return fileExists;
};

/**
 * Moves .env file to dist folder
 * @returns {boolean} True if .env file exists and is moved to dist folder.
 * Otherwise false
 */
const envFileMover = () => {
  ncp(sourcePath, destinationPath, (err) => {
    if (err && checkEnvFileExists()) {
      console.error(`Error on moving env file to dist folder:
      ${err}`);
      return false;
    }
  });

  return true;
};

export default envFileMover;
