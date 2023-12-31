// Statistics modules
import ExecHandHistory from './src/playhandHistory';
import ExecTournamentHistory from './src/tournamentHistory';

/**
 * Temporarily disables logging for building phase
 * build.mjs more information
 */
const disableLoggingForBuildPhase = () => {
  const shouldLog = process.env.DISPLAY_LOGS !== 'false';
  const originalLog = console.log;
  console.log = (...args) => {
    if (shouldLog) {
      originalLog.call(console, ...args);
    }
  };
};

const exec = (): number => {
  disableLoggingForBuildPhase();

  try {
    ExecHandHistory();
    ExecTournamentHistory();
    return 0;
  } catch (e) {
    console.error(`Error on executing scripts, error message:
    ${(e as Error).message}`);
    return 1;
  }
};

// Main entry point to execute script
exec();

export default exec;
