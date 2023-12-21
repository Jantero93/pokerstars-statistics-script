import * as dotenv from "dotenv";
import path from "path";

const scriptDir = __dirname;
const envPath = path.join(scriptDir, "..", ".env");
dotenv.config({ path: envPath });

const getHistoryFolderPath = () => {
  const path = process.env.HAND_HISTORY_FOLDER_PATH;

  if (!path) {
    throw new Error(
      "No hand history folder absolute path provided in .env file",
    );
  }

  return path;
};

const ENV = {
  historyFolderPath: getHistoryFolderPath(),
};

export default ENV;
