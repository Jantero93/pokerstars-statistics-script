import * as fs from 'fs';
import * as path from 'path';

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
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\r\n');
};

export default {
  getFilePathsFromFolder,
  getContentLinesFromFile
};
