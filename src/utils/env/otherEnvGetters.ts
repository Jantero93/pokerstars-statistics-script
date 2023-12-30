export const getMinimunPlaysToShow = () =>
  Number(process.env['MIN_GAMES_SHOW']) || 1;
