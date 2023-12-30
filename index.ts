// Statistics modules
import ExecHandHistory from './src/playhandHistory';
import ExecTournamentHistory from './src/tournamentHistory';

const exec = () => {
  console.clear();

  ExecHandHistory();
  ExecTournamentHistory();
};

// Main entry point to execute script
exec();
