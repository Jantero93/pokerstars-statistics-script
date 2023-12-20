import * as dotenv from "dotenv";

dotenv.config();

const getHistoryFolderPath = () => {
  const path = process.env.HAND_HISTORY_FOLDER_PATH;

  if (path === undefined || path === null || path === "") {
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
