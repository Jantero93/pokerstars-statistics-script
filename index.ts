// Statistics modules
import ExecHandHistory from './src/playhandHistory';
import ExecTournamentHistory from './src/tournamentHistory';
import { issueLink } from './src/utils/consts';

const exec = () => {
  try {
    ExecHandHistory();
    ExecTournamentHistory();
  } catch (e) {
    const errMsg = (e as Error).message;
    console.error(`Error on executing scripts, error message:\n${errMsg}`);
    console.info(`\nPlease if error relates to environment variables do these steps:

    1: Try building project without .env file on project's root folder and then execute script
    2: Set .env file on project's root folder and build project. There is .env.example for correct formatting
    If you still have issues with building and running project, please open issue at ${issueLink}`);
  }
};

// Main entry point to execute script
exec();
