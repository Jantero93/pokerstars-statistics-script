'use strict';
import { execaSync } from 'execa';
import { rimrafSync } from 'rimraf';
import envFileMover from './copy-env.mjs';

const ISSUE_LINK = `https://github.com/Jantero93/poker-statistics-script/issues`;

const EMPTY_STRING = '';

/**
 * Entry point for building project
 * @returns {void}
 */
const execBuild = () => {
  const isCompileSuccesful = runCompile();
  const isEnvFileMoveSuccesful = envFileMover();
  const isScriptWorkingSuccesfully = checkScriptWorks();

  const buildCompleted =
    isCompileSuccesful &&
    isEnvFileMoveSuccesful &&
    isScriptWorkingSuccesfully;

  if (!buildCompleted) {
    printGenericErrorMsg();
    deleteDistFolder();
    return;
  }

  console.info('Project builded successfully');
};

/**
 * Deletes dist folder if someone of build fails
 * @returns {boolean} Retuns true if delete is successful
 */
const deleteDistFolder = () => {
  try {
    rimrafSync('./dist', { glob: false });
    return true;
  } catch (error) {
    console.error(`Error on removing dist folder:\n${error}`);
    return false;
  }
};

/**
 * Compiles TypeScript files to JavaScript files
 *
 * Deletes dist folder and compiles typescript files and recreates dist folder
 * @returns {boolean} True if command was executed successfully
 */
const runCompile = () => {
  try {
    deleteDistFolder();

    const compileResult = execaSync('tsc', []);
    const err = compileResult.stderr;

    err && console.error(err)

    return err === EMPTY_STRING && compileResult.exitCode === 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Runs normal statistics script(s) without any logging
 * @returns {boolean} Return true if scripts runs without any throwable error
 */
const checkScriptWorks = () => {
  /**  Disable logging from main scripts for building phase
   This is connected in entry point of script (index.ts) */
  process.env.HIDE_LOGGING = 'true';

  try {
    // Check will normal script execution throw any error
    const result = execaSync('node', ['dist/index.js']);
    const err = result.stderr;

    err && console.error(err);

    return err === EMPTY_STRING && result.exitCode === 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Generic console log output if build fails
 */
const printGenericErrorMsg = () => {
  console.error('Project build failed');
  console.error('Executing clean up');

  console.info(`\nError probably relates to environment variables do these steps:

  1: Try building project without .env file on project's root folder and then execute script
  2: Set .env file on project's root folder and build project. There is .env.example for correct formatting
  If you still have issues with building and running project, please open issue at ${ISSUE_LINK}`);
};

// Execute compile & build
execBuild();
