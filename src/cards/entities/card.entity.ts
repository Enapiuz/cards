import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Deck } from './deck.entity';
import { SuitEnum } from '../constants/cards';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Deck)
  deck: string;

  @Column()
  suit: SuitEnum;

  @Column()
  value: string;

  @Column()
  order: number;

  @Column({ default: false })
  drawn: boolean;
}
