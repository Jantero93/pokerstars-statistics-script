'use strict';
import { execa } from 'execa';
import { rimraf } from 'rimraf';
import envFileMover from './copy-env.mjs';

const ISSUE_LINK = `https://github.com/Jantero93/poker-statistics-script/issues`;

/**
 * Main entry point for building project
 * @returns {Promise<void>}
 */
const execBuild = async () => {
  // Disable logging from main scripts for building phase
  process.env.DISPLAY_LOGS = 'false';

  const isBuildSuccesfull = await runBuild();
  const isEnvFileMoverSuccesfull = envFileMover();
  const isCheckScriptWorksSuccesfull = await checkScriptWorks();

  const noErrorsBuild =
    isBuildSuccesfull &&
    isEnvFileMoverSuccesfull &&
    isCheckScriptWorksSuccesfull;

  if (noErrorsBuild) {
    console.info('Project builded successfully');
    return;
  }

  printGenericErrorMsg();
  doCleanUp();
};

/**
 * Execute npm command from package.json
 *
 * Deletes dist folder and compiles typescript files and recreates dist folder
 * @returns {Promise<boolean>} True if command was executed successfully
 */
const runBuild = async () => {
  try {
    const buildResult = await execa('npm', ['run', 'compile']);
    const err = buildResult.stderr;

    logPossibleError(err);

    return err === '';
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Runs normal statistics script(s) without any logging
 * @returns {Promise<boolean>} Return true if scripts runs without any throwable error
 */
const checkScriptWorks = async () => {
  try {
    const result = await execa('npm', ['start']);
    const err = result.stderr;

    logPossibleError(err);

    return err === '';
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Deletes dist folder if someone of build fails
 * @returns {Promise<void>}
 */
const doCleanUp = async () =>
  await rimraf('./dist', { glob: false }, (error) => {
    if (error) {
      console.error(`Error on removing dist folder:
      ${error}`);
    }
  });

const logPossibleError = (e) => e && console.error(e);

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

// Execute compile
await execBuild();
