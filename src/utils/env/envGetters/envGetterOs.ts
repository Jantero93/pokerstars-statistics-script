import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { SystemEnv } from '../types';

/**
 * Try to get essential environment variables from system
 * @returns Return null if can not detenct environment
 * variables from system
 */
const getEnvValuesFromOs = (): SystemEnv | null => {
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

/**
 * @param handHistoryPath Hand history folder path.
 * This folder includes player/accounts history folders
 * @returns Folder name which equals player name.
 *
 * If hand history folder contains multiple folders then first one will be picked
 */
const getPlayerNameFromhandhistoryFolder = (
  handHistoryPath: string
): string | null => {
  try {
    const entries = fs.readdirSync(handHistoryPath, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((folder) => folder.name);

    const playerFolder = folders.at(0);

    if (folders.length > 1 && playerFolder) {
      console.warn(`Found multiple player folders in, picking the first one: ${playerFolder}
        Please set environment variables in .env file if you want use different account`);
      return playerFolder;
    }

    if (folders.length === 0) {
      console.error(`Not found player folder(s) in default path
      Please provide HandHistory and/or TournSummary folder path in .env`);
      return null;
    }

    return playerFolder ?? null;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : err;
    console.error('Generic error on getting envs automatically:');
    console.error(errorMsg);
    return null;
  }
};

export default getEnvValuesFromOs;
