import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Card } from './card.entity';

export enum DeckType {
  FULL = 0,
  SHORT = 1,
}

@Entity()
export class Deck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: DeckType;

  @Column()
  shuffled: boolean;

  @OneToMany(() => Card, (card: Card) => card.deck, { eager: true })
  cards: Card[];
}
