import ncp from 'ncp';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const copyFile = promisify(ncp);

/**
 * Checks if the .env file exists in the project's root folder.
 * @returns {boolean} True if the .env file exists in the root folder of the project.
 */
const checkEnvFileExists = () => {
  const rootDir = path.resolve();
  const filepath = path.join(rootDir, 'dist', '.env');
  return fs.existsSync(filepath);
};

/**
 * Moves the .env file to the dist folder.
 * @returns {Promise<boolean>} True if the .env file is successfully copied to the dist folder, otherwise false.
 */
const envFileMover = async () => {
  const SOURCE_PATH = './.env';
  const DESTINATION_PATH = './dist/.env';

  try {
    await copyFile(SOURCE_PATH, DESTINATION_PATH);
    return true;
  } catch (err) {
    if (checkEnvFileExists()) {
      console.error(`Error moving .env file to dist folder: ${err}`);
    }
    return false;
  }
};

export default envFileMover;
