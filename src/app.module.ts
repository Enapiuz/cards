import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './cards/entities/card.entity';
import { Deck } from './cards/entities/deck.entity';

@Module({
  imports: [
    CardsModule,
    // hardcoded because why not
    // definitely use ENV config for real app
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'cards',
      entities: [Card, Deck],
      // also not for production
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
