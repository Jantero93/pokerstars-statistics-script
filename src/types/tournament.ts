/***
 * General statistics type for tournament and sit & go's
 */
export type TournamentStats = {
  /**
   * Spend money in buy-ins (and rakes)
   */
  buyIns: number;
  /**
   * Money won by tournaments / sit & go's
   */
  earnings: number;
  /**
   * Count of played tournaments / sit & go's
   */
  tournamentCount: number;
  /**
   * Count of tournament / sit & go wins
   */
  tournamentWins: number;
};

/**
 * @returns {TournamentStats} Initializes general tournament and sit & go statistics object
 */
export const createTournamentStatsObject = (): TournamentStats => ({
  buyIns: 0,
  earnings: 0,
  tournamentCount: 0,
  tournamentWins: 0
});
