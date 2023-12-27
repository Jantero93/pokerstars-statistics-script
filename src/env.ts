import * as dotenv from 'dotenv';
import path from 'path';

const dotEnvLocation = path.join(__dirname, '..', '.env');
dotenv.config({ path: dotEnvLocation });

const getEnv = (key: string): string => {
  const env = process.env[key];

  if (!env) throw new Error(`No ${env} provided in .env file`);

  return env;
};

const ENV = {
  handHistoryFolderPath: getEnv('HAND_HISTORY_FOLDER_PATH'),
  tournamentStatisticsFolderPath: getEnv('TOURNAMENT_STATISTICS_FOLDER_PATH'),
  playerName: getEnv('PLAYER_NAME')
};

export default ENV;
