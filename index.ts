import ExecHandHistory from './src/playedhandhistory/mainCalculation';
import ExecTournamentHistory from './src/tournamentStatistics/mainCalculation';
import ExecCashgameEarnings from './src/cashgameEarnings/mainCalculation';

/**
 * HIDE_LOGGING is set for building phase when script is tested.
 *
 * When script is executed outside building phase HIDE_LOGGING is not set/used.
 * More information on build.mjs
 *
 * Later this will be based on NODE_ENV, atm bottom of my priority list
 */
const disableLoggingForBuildPhase = () => {
  if (process.env.HIDE_LOGGING === 'true') {
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
    ExecCashgameEarnings();
    ExecTournamentHistory();
  } catch (e) {
    const msg = e instanceof Error ? e.message : e;
    console.error(`Error on executing scripts, error message:\n${msg}`);
  }
};

exec();
