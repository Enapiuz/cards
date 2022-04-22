import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Deck } from './entities/deck.entity';
import { Connection, InsertResult, Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { BadRequestException, Injectable } from '@nestjs/common';

/**
 * Data layer for all the operations with cards and decks.
 */
@Injectable()
export class CardsData {
  public constructor(
    @InjectRepository(Deck)
    private readonly decksRepository: Repository<Deck>,
    @InjectRepository(Card)
    private readonly cardsRepository: Repository<Card>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  public makeDeck(): Deck {
    return this.decksRepository.create();
  }

  public makeCard(): Card {
    return this.cardsRepository.create();
  }

  public insertCard(cards: Card[] | Card): Promise<InsertResult> {
    return this.cardsRepository.insert(cards);
  }

  public insertDeck(deck: Deck): Promise<InsertResult> {
    return this.decksRepository.insert(deck);
  }

  public async getCardsByIds(ids: number[]): Promise<Card[]> {
    return this.cardsRepository.findByIds(ids);
  }

  public async countCardsInDeck(deckId: string): Promise<number> {
    return this.cardsRepository.count({ deck: deckId, drawn: false });
  }

  public async loadDeck(deckId: string): Promise<Deck> {
    const deck = await this.decksRepository.findOne({ id: deckId });
    if (deck) {
      deck.cards = await this.cardsRepository
        .createQueryBuilder('card')
        .where('card.deck = :id', { id: deckId })
        .andWhere('card.drawn is false')
        .orderBy('card.order', 'ASC')
        .getMany();
    }
    return deck;
  }

  public async drawCards(deckId: string, count: number): Promise<number[]> {
    return this.connection.transaction<number[]>(async (manager) => {
      const cardsToDrawQuery = await manager
        .getRepository<Card>(Card)
        .createQueryBuilder('card')
        .select(['id'])
        .where('deckId = :id', { id: deckId })
        .andWhere('drawn is false')
        .orderBy('order', 'DESC')
        .limit(count);

      const res = await manager
        .getRepository<Card>(Card)
        .createQueryBuilder('card')
        .update<Card>(Card, { drawn: true })
        .where('card."deckId" = :id', { id: deckId })
        .andWhere(`card.id in (${cardsToDrawQuery.getQuery()})`)
        .returning('id')
        .updateEntity(true)
        .execute();
      if (res.raw.length !== count) {
        throw new BadRequestException(
          `Requested invalid amount of cards. Requested: ${count}, available to draw: ${res.raw.length}`,
        );
      }
      return res.raw.map((item) => item.id);
    });
  }
}
