import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import logger from '../logger';
import { EnvConfig, getSystemLocalization } from './env';

const tryGetDefaultEnvValues = (): EnvConfig | null => {
  const { homedir } = os.userInfo();
  const tournamentFolderName = 'TournSummary';
  const handHistoryFolderName = 'HandHistory';
  const appDataPath = 'AppData\\Local\\PokerStars';

  const tournamentHistoryPath = path.join(
    homedir,
    appDataPath,
    tournamentFolderName
  );

  const handHistoryPath = path.join(
    homedir,
    appDataPath,
    handHistoryFolderName
  );

  const playerName = getPlayerNameFromhandhistoryFolder(handHistoryPath);

  if (!playerName) {
    return null;
  }

  const fullHandPath = path.join(handHistoryPath, playerName);
  const fullTournamentPath = path.join(tournamentHistoryPath, playerName);

  return {
    HAND_HISTORY_FOLDER_PATH: fullHandPath,
    PLAYER_NAME: playerName,
    TOURNAMENT_STATISTICS_FOLDER_PATH: fullTournamentPath,
    LOCALIZATION: getSystemLocalization()
  };
};

const getPlayerNameFromhandhistoryFolder = (
  handHistoryPath: string
): string | null => {
  try {
    const entries = fs.readdirSync(handHistoryPath, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((folder) => folder.name);

    if (folders.length > 1) {
      const logMsg = `Found multiple player folders in, picking the first one: ${folders[0]}`;
      const logMsg2 =
        'Please set PLAYER_NAME in .env file ' +
        'if you want different player account';

      logger(logMsg, 'yellow');
      logger(logMsg2, 'yellow');
    }

    if (folders.length <= 0) {
      logger('Not found player folder(s) in default path', 'red');
      logger(
        'Please provide HandHistory and/or TournSummary folder path in .env',
        'red'
      );
      return null;
    }

    return folders[0];
  } catch (e) {
    const errorMsg = JSON.stringify((e as Error).message);
    logger('Generic error on getting envs automatically:', 'red');
    logger(errorMsg, 'red');
    return null;
  }
};

export default tryGetDefaultEnvValues;
