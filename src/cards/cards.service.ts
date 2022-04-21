import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeckDto, CreateDeckResponseDto } from './dto/create-deck.dto';
import { Deck, DeckType } from './entities/deck.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { FullValues, ShortValues, SuitEnum } from './constants/cards';
import {
  OpenDeckCard,
  OpenDeckDto,
  OpenDeckResponseDto,
} from './dto/open-deck.dto';

@Injectable()
export class CardsService {
  public constructor(
    @InjectRepository(Deck)
    private readonly decksRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
  ) {}

  public async createDeck(
    createDeckDto: CreateDeckDto,
  ): Promise<CreateDeckResponseDto> {
    const deckType = this.convertTypeToEnum(createDeckDto.type);
    const deck = this.decksRepository.create();
    deck.type = deckType;
    deck.shuffled = createDeckDto.shuffled;
    await this.decksRepository.insert(deck);
    const cards = this.generateCards(deck.type, deck.id);
    await this.cardsRepository.insert(cards);
    const result = new CreateDeckResponseDto();
    result.deckId = deck.id;
    result.type = this.convertEnumToType(deck.type);
    result.shuffled = deck.shuffled;
    result.remaining = await this.cardsRepository.count({ deck: deck.id });
    return result;
  }

  public async openDeck(
    openDeckDto: OpenDeckDto,
  ): Promise<OpenDeckResponseDto> {
    const deck = await this.decksRepository
      .createQueryBuilder('deck')
      .leftJoinAndSelect('deck.cards', 'card')
      .where('deck.id = :id', { id: openDeckDto.deckId })
      .andWhere('card.drawn is false')
      .orderBy('card.order', 'ASC')
      .getOneOrFail();
    const result = new OpenDeckResponseDto();
    result.deckId = deck.id;
    result.type = this.convertEnumToType(deck.type);
    result.shuffled = deck.shuffled;
    result.remaining = deck.cards.length;
    result.cards = deck.cards.map(
      (card): OpenDeckCard => ({
        value: card.value,
        suit: card.suit,
        code: this.makeCardCode(card),
      }),
    );
    return result;
  }

  public drawCard() {
    console.log('draw card');
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

  protected generateCards(mode: DeckType, deckId: string): Card[] {
    const values = mode === DeckType.FULL ? FullValues : ShortValues;
    const cards: Card[] = [];
    let counter = 0;
    for (const suit in SuitEnum) {
      for (const value of values) {
        const card = this.cardsRepository.create();
        card.suit = suit as SuitEnum;
        card.value = value;
        card.deck = deckId;
        card.order = counter++;
        cards.push(card);
      }
    }
    return cards;
  }
}
