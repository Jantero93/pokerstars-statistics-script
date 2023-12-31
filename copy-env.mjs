import ncp from 'ncp';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks is there .env file in project's root folder
 * @returns {boolean} True if .env file exists in root folder of project
*/
const checkEnvFileExists = () => {
  const filepath = path.join(__dirname, 'dist', '.env');
  return fs.existsSync(filepath);
};

/**
 * Moves .env file to dist folder
 * @returns {boolean} True if .env file exists and is moved to dist folder.
 * Otherwise false
*/
const envFileMover = () => {
  const SOURCE_PATH = './.env';
  const DESTINATION_PATH = './dist/.env';

  ncp(SOURCE_PATH, DESTINATION_PATH, (err) => {
    if (err && checkEnvFileExists()) {
      console.error(`Error on moving env file to dist folder:
      ${err}`);
      return false;
    }
  });

  return true;
};

export default envFileMover;
