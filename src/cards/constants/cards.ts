export enum SuitEnum {
  SPADES = 'SPADES',
  HEARTS = 'HEARTS',
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
}

export const Suits = [
  SuitEnum.SPADES,
  SuitEnum.HEARTS,
  SuitEnum.CLUBS,
  SuitEnum.DIAMONDS,
];

export const ShortValues = [
  '6',
  '7',
  '8',
  '9',
  '10',
  'JACK',
  'QUEEN',
  'KING',
  'ACE',
];

export const AdditionalValues = ['2', '3', '4', '5'];

export const FullValues = [...AdditionalValues, ...ShortValues];
