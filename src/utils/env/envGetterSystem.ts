import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './env';

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
    TOURNAMENT_STATISTICS_FOLDER_PATH: fullTournamentPath
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
        'Please set environment variables in .env file if you want use different account';
      console.warn(logMsg);
      console.warn(logMsg2);
    }

    if (folders.length <= 0) {
      console.error('Not found player folder(s) in default path');
      console.error(
        'Please provide HandHistory and/or TournSummary folder path in .env'
      );
      return null;
    }

    return folders[0];
  } catch (e) {
    const errorMsg = (e as Error).message;
    console.error('Generic error on getting envs automatically:');
    console.error(errorMsg);
    return null;
  }
};

export default tryGetDefaultEnvValues;
