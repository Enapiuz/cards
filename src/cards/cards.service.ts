import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDeckRequestDto,
  CreateDeckResponseDto,
} from './dto/create-deck.dto';
import { DeckType } from './entities/deck.entity';
import { Card } from './entities/card.entity';
import { FullValues, ShortValues, SuitEnum } from './constants/cards';
import { OpenDeckRequestDto, OpenDeckResponseDto } from './dto/open-deck.dto';
import { DrawCardRequestDto, DrawCardResponseDto } from './dto/draw-card.dto';
import { CardData } from './dto/card';
import { CardsData } from './cards.data';

@Injectable()
export class CardsService {
  public constructor(private readonly cardsData: CardsData) {}

  public async createDeck(
    createDeckDto: CreateDeckRequestDto,
  ): Promise<CreateDeckResponseDto> {
    const deckType = this.convertTypeToEnum(createDeckDto.type);
    const deck = this.cardsData.makeDeck();
    deck.type = deckType;
    deck.shuffled = createDeckDto.shuffled;
    await this.cardsData.insertDeck(deck);
    const cards = this.generateCards(deck.type, deck.id, deck.shuffled);
    await this.cardsData.insertCard(cards);
    const result = new CreateDeckResponseDto();
    result.deckId = deck.id;
    result.type = this.convertEnumToType(deck.type);
    result.shuffled = deck.shuffled;
    result.remaining = await this.cardsData.countCardsInDeck(deck.id);
    return result;
  }

  public async openDeck(
    openDeckDto: OpenDeckRequestDto,
  ): Promise<OpenDeckResponseDto> {
    const deck = await this.cardsData.loadDeck(openDeckDto.deckId);
    if (!deck) {
      throw new NotFoundException('Deck not found');
    }
    const result = new OpenDeckResponseDto();
    result.deckId = deck.id;
    result.type = this.convertEnumToType(deck.type);
    result.shuffled = deck.shuffled;
    result.remaining = deck.cards.length;
    result.cards = deck.cards.map(
      (card): CardData => ({
        value: card.value,
        suit: card.suit,
        code: this.makeCardCode(card),
      }),
    );
    return result;
  }

  public async drawCard(
    drawCardDto: DrawCardRequestDto,
  ): Promise<DrawCardResponseDto> {
    const ids = await this.cardsData.drawCards(
      drawCardDto.deckId,
      drawCardDto.count,
    );
    // Don't like this.
    const cards = await this.cardsData.getCardsByIds(ids);
    const response = new DrawCardResponseDto();
    response.cards = cards.map((card) => ({
      value: card.value,
      suit: card.suit,
      code: this.makeCardCode(card),
    }));
    return response;
  }

  protected convertTypeToEnum(input: string): DeckType {
    switch (input) {
      case DeckType[DeckType.FULL]:
        return DeckType.FULL;
      case DeckType[DeckType.SHORT]:
        return DeckType.SHORT;
      default:
        throw new BadRequestException(`Wrong deck type "${input}"`);
    }
  }

  protected convertEnumToType(input: DeckType): string {
    return DeckType[input];
  }

  protected makeCardCode(card: Card): string {
    return `${card.value[0]}${card.suit[0]}`;
  }

  protected generateCards(
    mode: DeckType,
    deckId: string,
    shuffled: boolean,
  ): Card[] {
    const values = mode === DeckType.FULL ? FullValues : ShortValues;
    const cards: Card[] = [];
    const counter = this.makeCounter(
      values.length * Object.keys(SuitEnum).length,
      shuffled,
    );
    for (const suit in SuitEnum) {
      for (const value of values) {
        const card = this.cardsData.makeCard();
        card.suit = suit as SuitEnum;
        card.value = value;
        card.deck = deckId;
        card.order = counter.next().value;
        cards.push(card);
      }
    }
    return cards;
  }

  protected *makeCounter(size: number, shuffle: boolean): Generator<number> {
    const arr = [...Array(size).keys()];
    if (shuffle) {
      // Inefficient way to sort an array but enough for now
      arr.sort(() => Math.random() - 0.5);
    }
    for (const num of arr) {
      yield num;
    }
  }
}
