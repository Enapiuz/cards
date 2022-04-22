import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { DeckType } from '../entities/deck.entity';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateDeckRequestDto {
  @JoiSchema(
    Joi.string()
      .allow(DeckType[DeckType.FULL], DeckType[DeckType.SHORT])
      .required(),
  )
  type!: string;

  @JoiSchema(Joi.boolean().required())
  shuffled!: boolean;
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateDeckResponseDto {
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
}
