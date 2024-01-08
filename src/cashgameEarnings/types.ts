import { PokerGame } from '../types/general';

export type ParsedGameRawData = [PokerGame, string[]];

// laske onko pelaaja collectanut potin

// laske paljonko pistänyt itse pottiin ja vähennä collectionista

// jos ei collectannut niin vähennä suoraan
// splittiä ei tarvi huomioida
// huomioi re raiset

export enum ActionKeyword {
  'calls' = 'calls',
  'posts' = 'posts',
  // Notice re-raises
  'raises' = 'raises',
  'collected' = 'collected',
  'bets' = 'bets',
  'Uncalled bet' = 'Uncalled bet'
}
/**
 * @returns Keywords to filter only lines that matter in calculations
 */
export const createKeywordList = () => Array.from(Object.values(ActionKeyword));
