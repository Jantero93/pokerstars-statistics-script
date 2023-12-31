import * as fs from 'fs';
import * as path from 'path';
import { POKERSTARS_FILE_LINEBREAK } from '../../globalConsts';

/**
 * @param dirPath Path to directory where history files are
 * @returns Full paths of files
 */
const getFilePathsFromFolder = (dirPath: string): string[] =>
  fs
    .readdirSync(dirPath)
    .filter((filename) => filename.endsWith('.txt'))
    .map((fileName) => path.join(dirPath, fileName));

/**
 * @param filePath Whole File path which to read
 * @returns Array of lines (linebreak hard coded \r\n)
 */
const getContentLinesFromFile = (filePath: string): string[] => {
  const POKERSTARS_FILE_ENCODING = 'utf8';

  const content = fs.readFileSync(filePath, POKERSTARS_FILE_ENCODING);

  return content.split(POKERSTARS_FILE_LINEBREAK);
};

export default {
  getFilePathsFromFolder,
  getContentLinesFromFile
};
