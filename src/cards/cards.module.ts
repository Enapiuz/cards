import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Deck } from './entities/deck.entity';
import { JoiPipeModule } from 'nestjs-joi';
import { CardsData } from './cards.data';

@Module({
  imports: [TypeOrmModule.forFeature([Card, Deck]), JoiPipeModule],
  controllers: [CardsController],
  providers: [CardsService, CardsData],
})
export class CardsModule {}
