import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Sets needed configuration to read .env from root directory
 */
const setEnvFileConfig = () => {
  const pathToRoot = '../../..';
  const dotEnvLocation = path.resolve(__dirname, pathToRoot, '.env');

  dotenv.config({ path: dotEnvLocation });
};

export default setEnvFileConfig;
