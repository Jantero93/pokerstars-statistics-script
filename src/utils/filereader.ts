import * as fs from 'fs';
import * as path from 'path';

/**
 * @param dirPath Path to directory where history files are
 * @returns Full paths of files
 */
const getFilePathsFromFolder = (dirPath: string): string[] => {
  try {
    return fs
      .readdirSync(dirPath)
      .filter((filename) => filename.endsWith('.txt'))
      .map((fileName) => path.join(dirPath, fileName));
  } catch (e) {
    const errMsg = (e as Error).message;
    throw new Error(
      `Could not find history folders on ${dirPath}, err message: ${errMsg}`
    );
  }
};

/**
 * @param filePath Whole File path which to read
 * @returns Array of lines (linebreak hard coded \r\n)
 */
const getContentLinesFromFile = (filePath: string): string[] => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\r\n');
  } catch (e) {
    const errMsg = (e as Error).message;
    throw new Error(
      `Could not read lines from ${filePath} error message: ${errMsg}`
    );
  }
};

export default {
  getFilePathsFromFolder,
  getContentLinesFromFile
};
