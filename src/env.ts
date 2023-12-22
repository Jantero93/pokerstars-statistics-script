import * as dotenv from "dotenv";
import path from "path";

const scriptDir = __dirname;
const envPath = path.join(scriptDir, "..", ".env");
dotenv.config({ path: envPath });

const getHandHistoryFolderPath = () => {
  const path = process.env.HAND_HISTORY_FOLDER_PATH;

  if (!path) {
    throw new Error("No HAND_HISTORY_FOLDER_PATH provided in .env file");
  }

  return path;
};

const getTournamentStatisticFolderPath = () => {
  const path = process.env.TOURNAMENT_STATISTICS_FOLDER_PATH;

  if (!path) {
    throw new Error(
      "No TOURNAMENT_STATISTICS_FOLDER_PATH provided in .env file",
    );
  }

  return path;
};

const getPlayerName = () => {
  const playerName = process.env.PLAYER_NAME;

  if (!playerName) {
    throw new Error("No PLAYER_NAME provided in .env file");
  }

  return playerName;
};

const ENV = {
  handHistoryFolderPath: getHandHistoryFolderPath(),
  tournamentStatisticsFolderPath: getTournamentStatisticFolderPath(),
  playerName: getPlayerName(),
};

export default ENV;
