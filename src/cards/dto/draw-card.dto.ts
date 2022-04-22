import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { CardData } from './card';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class DrawCardRequestDto {
  @JoiSchema(Joi.string().guid({ version: 'uuidv4' }).required())
  deckId: string;
  @JoiSchema(Joi.number().min(1).required())
  count: number;
}

export const CardSchema = Joi.object().keys({
  value: Joi.string().required(),
  suit: Joi.string().required(),
  code: Joi.string().required(),
});

@JoiSchemaOptions({
  allowUnknown: false,
})
export class DrawCardResponseDto {
  @JoiSchema(Joi.array().items(CardSchema).required())
  cards: CardData[];
}
