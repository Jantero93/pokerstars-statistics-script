import { execaSync } from 'execa';
import { rimrafSync } from 'rimraf';
import runEnvFileMover from './copy-env.mjs';
import { EMPTY_STRING, ISSUE_LINK } from './globalConsts.js';

const DIST_FOLDER = './dist';

/**
 * Entry point for building project
 * @returns {void}
 */
const execBuild = () => {
  if (!compileProject() || !runEnvFileMover() || !runProjectScript()) {
    handleBuildFailure();
    return;
  }

  console.info('Project built successfully');
};

/**
 * Deletes the dist folder.
 * @returns {boolean} Returns true if delete is successful
 */
const deleteDistFolder = () => {
  try {
    rimrafSync(DIST_FOLDER, { glob: false });
    return true;
  } catch (error) {
    logError(`Error deleting dist folder:`, error);
    return false;
  }
};

/**
 * Compiles TypeScript files to JavaScript.
 * Deletes dist folder, compiles TypeScript files, and recreates dist folder.
 * @returns {boolean} True if command was executed successfully
 */
const compileProject = () => {
  try {
    deleteDistFolder();
    const { stderr, exitCode } = execaSync('tsc', []);

    if (stderr) logError(stderr);
    return stderr === EMPTY_STRING && exitCode === 0;
  } catch (error) {
    logError('Compilation error:', error);
    return false;
  }
};

/**
 * Runs the main script to check if it works without errors.
 * @returns {boolean} Returns true if script runs without errors
 */
const runProjectScript = () => {
  process.env.HIDE_LOGGING = 'true'; // Disable logging during the build phase

  try {
    const { stderr, exitCode } = execaSync('node', ['dist/index.js']);

    if (stderr) logError(stderr);

    return stderr === EMPTY_STRING && exitCode === 0;
  } catch (error) {
    logError('Script execution error:', error);
    return false;
  }
};

/**
 * Logs an error to the console.
 * @param {string} message - The error message.
 * @param {Error} [error] - Optional error object to log.
 */
const logError = (message, error = null) => {
  console.error(message);

  if (error) console.error(error);
};

/**
 * Handles build failure by printing a generic error message and cleaning up.
 */
const handleBuildFailure = () => {
  console.error('Project build failed. Executing cleanup...');
  deleteDistFolder();

  console.info(`
Error probably relates to environment variables. Please follow these steps:

1. Try building the project without the .env file in the root folder, then run the script.
2. Set up the .env file in the root folder and rebuild the project. Use .env.example for reference.

If you still encounter issues, please open an issue at ${ISSUE_LINK}`);
};

// Execute compile & build
execBuild();
