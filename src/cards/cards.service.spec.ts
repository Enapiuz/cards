import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { CardsData } from './cards.data';
import { Card } from './entities/card.entity';
import { Deck } from './entities/deck.entity';

describe('CardsService', () => {
  let service: CardsService;
  const storage = new (class {
    data: any = { cardsCount: 0 };
    setData = jest.fn((data) => {
      this.data = data;
    });
  })();
  let mockedData: MockedData;

  class MockedData {
    constructor(private readonly data = storage) {}
    makeDeck = jest.fn(() => []);
    makeCard = jest.fn(() => []);
    insertCard = jest.fn(async (cards: Card[] | Card): Promise<any> => ({}));
    insertDeck = jest.fn(async (deck: Deck): Promise<any> => ({}));
    getCardsByIds = jest.fn(async (ids: number[]): Promise<Card[]> => []);
    countCardsInDeck = jest.fn(
      async (deckId: string): Promise<number> => this.data.data.cardsCount,
    );
    loadDeck = jest.fn(async (deckId: string): Promise<Deck> => {
      const deck = new Deck();
      deck.cards = [];
      return deck;
    });
    drawCards = jest.fn(
      async (deckId: string, count: number): Promise<number[]> => [1, 2, 3],
    );
  }

  beforeEach(async () => {
    mockedData = new MockedData();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: CardsData,
          useFactory: () => {
            return mockedData;
          },
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a proper full unshuffled deck', async () => {
    storage.setData({ cardsCount: 52 });
    const deck = await service.createDeck({ type: 'FULL', shuffled: false });
    expect(deck.type).toEqual('FULL');
    expect(deck.shuffled).toBeFalsy();
    expect(deck.remaining).toEqual(52);
    expect(mockedData.makeDeck.mock.calls.length).toBe(1);
    expect(mockedData.insertDeck.mock.calls.length).toBe(1);
    expect(mockedData.insertCard.mock.calls.length).toBe(1);
    expect(mockedData.countCardsInDeck.mock.calls.length).toBe(1);
  });

  it('should create a proper short shuffled deck', async () => {
    storage.setData({ cardsCount: 36 });
    const deck = await service.createDeck({ type: 'SHORT', shuffled: true });
    expect(deck.type).toEqual('SHORT');
    expect(deck.shuffled).toBeTruthy();
    expect(deck.remaining).toEqual(36);
    expect(mockedData.makeDeck.mock.calls.length).toBe(1);
    expect(mockedData.insertDeck.mock.calls.length).toBe(1);
    expect(mockedData.insertCard.mock.calls.length).toBe(1);
    expect(mockedData.countCardsInDeck.mock.calls.length).toBe(1);
  });

  it('should fail on creating invalid deck', async () => {
    const t = async () => service.createDeck({ type: 'WRONG', shuffled: true });
    await expect(t()).rejects.toThrow('Wrong deck type "WRONG"');
    expect(mockedData.makeDeck.mock.calls.length).toBe(0);
    expect(mockedData.insertDeck.mock.calls.length).toBe(0);
    expect(mockedData.insertCard.mock.calls.length).toBe(0);
    expect(mockedData.countCardsInDeck.mock.calls.length).toBe(0);
  });

  it('should open a deck', async () => {
    await service.openDeck({ deckId: '' });
    expect(mockedData.loadDeck.mock.calls.length).toBe(1);
  });
});
