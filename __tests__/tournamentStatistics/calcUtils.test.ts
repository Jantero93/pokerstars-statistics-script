import * as utils from '../../src/tournamentStatistics/calcUtils';
import {
  wonTournamentLines,
  lostTournamentLines
} from '../testData/tournamentFiles/tournamentExamplesLines';
import {
  testTournamentStats1,
  testTournamentStats2
} from '../testData/tournamentFiles/tournamentStatsExamples';

jest.mock(
  '../../src/utils/env/main.ts',
  () => require('../../__mocks__/env').default
);

const {
  calcWinSum,
  calcBuyIn,
  calcReEntriesSum,
  didWinTournament,
  calcTournamentWinPercentage,
  calcEarningComparedToCosts
} = utils;

describe('Tournament Stats Utils', () => {
  describe('calcWinSum', () => {
    it('Won tournament, won 82 250', () => {
      const winSum = calcWinSum(wonTournamentLines);
      expect(winSum).toBe(82_875);
    });

    it('Should return 0 if player line is not found', () => {
      const winSum = calcWinSum(lostTournamentLines);
      expect(winSum).toBe(0);
    });
  });

  describe('#1 SNG, 21 250 / 3750 = 25 000', () => {
    it('Should calculate the correct buy-in sum', () => {
      expect(calcBuyIn(wonTournamentLines)).toBe(25_000);
    });

    it('#2 SNG, 21 250 / 3750 = 25 000', () => {
      expect(calcBuyIn(lostTournamentLines)).toBe(25_000);
    });
  });

  describe('calcReEntriesSum', () => {
    it('No re-entries, should be 0', () => {
      expect(calcReEntriesSum(wonTournamentLines)).toBe(0);
      expect(calcReEntriesSum(lostTournamentLines)).toBe(0);
    });

    // TODO: Re-entries test data
  });

  describe('didWinTournament', () => {
    it('Won tournament, should return true', () => {
      expect(didWinTournament(wonTournamentLines)).toBe(true);
    });

    it('6th place, should return false', () => {
      expect(didWinTournament(lostTournamentLines)).toBe(false);
    });
  });

  describe('calcTournamentWinPercentage', () => {
    it('Should return win percentage 20 % (5/25)', () => {
      const winPercentage = calcTournamentWinPercentage(testTournamentStats1);
      expect(winPercentage).toBe(20);
    });

    it('Should return win percentage 33,33 % (1/3)', () => {
      const winPercentage = calcTournamentWinPercentage(testTournamentStats2);
      expect(winPercentage).toBeLessThan(33.4);
      expect(winPercentage).toBeGreaterThan(33.3);
    });
  });

  describe('calcEarningComparedToCosts', () => {
    it('Tournament earnings/costings 15 000 / 5000 => 200 %', () => {
      const { buyIns, earnings } = testTournamentStats1;
      const compared = calcEarningComparedToCosts(buyIns, earnings);
      expect(compared).toBe(200);
    });

    it('Tournament earnings/costings 7 000 / 12 000 => ~ -41,66... %', () => {
      const { buyIns, earnings } = testTournamentStats2;
      const compared = calcEarningComparedToCosts(buyIns, earnings);
      expect(compared).toBeLessThan(-41.6);
      expect(compared).toBeGreaterThan(-41.7);
    });
  });
});
