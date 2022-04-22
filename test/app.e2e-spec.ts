import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('[POST] /deck/create', () => {
    it('successfully creates a deck', async () => {
      return request(app.getHttpServer())
        .post('/deck/create')
        .send({ type: 'FULL', shuffled: false })
        .expect(201);
    });

    it('successfully opens a deck', async () => {
      const deck = await request(app.getHttpServer())
        .post('/deck/create')
        .send({ type: 'FULL', shuffled: false })
        .expect(201);
      const id = deck.body.deckId;

      await request(app.getHttpServer())
        .post('/deck/open')
        .send({ deckId: id })
        .expect(200);
    });

    it('successfully draws a card', async () => {
      const deckResponse = await request(app.getHttpServer())
        .post('/deck/create')
        .send({ type: 'FULL', shuffled: false })
        .expect(201);
      const id = deckResponse.body.deckId;

      const openFirstResponse = await request(app.getHttpServer())
        .post('/deck/open')
        .send({ deckId: id })
        .expect(200);
      expect(openFirstResponse.body.remaining).toBe(52);

      const drawResponse = await request(app.getHttpServer())
        .post('/card/draw')
        .send({ deckId: id, count: 1 })
        .expect(200);
      expect(drawResponse.body.cards.length).toBe(1);

      const openSecondResponse = await request(app.getHttpServer())
        .post('/deck/open')
        .send({ deckId: id })
        .expect(200);
      expect(openSecondResponse.body.remaining).toBe(51);
    });
  });
});
