import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { DeckType } from '../entities/deck.entity';
import { CardData } from './card';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OpenDeckRequestDto {
  @JoiSchema(Joi.string().guid({ version: 'uuidv4' }).required())
  deckId!: string;
}

export const OpenDeckCardSchema = Joi.object().keys({
  value: Joi.string().required(),
  suit: Joi.string().required(),
  code: Joi.string().required(),
});

@JoiSchemaOptions({
  allowUnknown: false,
})
export class OpenDeckResponseDto {
  @JoiSchema(Joi.string().guid({ version: 'uuidv4' }).required())
  deckId!: string;
  @JoiSchema(
    Joi.string()
      .allow(DeckType[DeckType.FULL], DeckType[DeckType.SHORT])
      .required(),
  )
  type!: string;
  @JoiSchema(Joi.boolean().required())
  shuffled!: boolean;
  @JoiSchema(Joi.number().required())
  remaining!: number;
  @JoiSchema(Joi.array().items(OpenDeckCardSchema).required())
  cards!: CardData[];
}
