import { TypeOrmModule } from '@nestjs/typeorm';
import { createConnection } from 'typeorm';
import { Card } from '../cards/entities/card.entity';
import { Deck } from '../cards/entities/deck.entity';
import { JoiPipeModule } from 'nestjs-joi';
import { Connection } from 'typeorm';

export const TypeOrmTestingModule = async () => [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5434,
    username: 'postgres',
    password: 'root',
    database: 'cards',
    entities: [Card, Deck],
    name: 'test',
    // also not for production
    synchronize: true,
  }),
  TypeOrmModule.forFeature([Card, Deck]),
  JoiPipeModule,
  {
    provide: Connection,
    useValue: await createConnection({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5434,
      username: 'postgres',
      password: 'root',
      database: 'cards',
      entities: [Card, Deck],
      name: 'test',
      // also not for production
      synchronize: true,
    }),
  },
];
