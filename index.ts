// Main entry point to execute history statistics
import ExecHandHistory from './src/playhandHistory';
import ExecTournamentHistory from './src/tournamentHistory';

const exec = () => {
  console.clear();

  ExecHandHistory();
  ExecTournamentHistory();
};

exec();
