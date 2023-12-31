import ExecHandHistory from './src/playhandHistory';
import ExecTournamentHistory from './src/tournamentHistory';

const disableLoggingForBuildPhase = () => {
  /**
   * HIDE_LOGGING is undefined. It is only set true on building phase when script is tested
   * When script is executed outside building phase HIDE_LOGGING is not set.
   * More information on build.mjs file on project root
   */
  const hideLogging = process.env.HIDE_LOGGING === 'true';
  if (hideLogging) {
    console.log = () => undefined;
  }
};

/**
 * Main entry point for executing statistics scripts
 */
const exec = () => {
  disableLoggingForBuildPhase();

  try {
    ExecHandHistory();
    ExecTournamentHistory();
  } catch (e) {
    console.error(
      `Error on executing scripts, error message:
      ${e instanceof Error ? e.message : e}`
    );
  }
};

exec();
