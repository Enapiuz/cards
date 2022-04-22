import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CardsService } from './cards.service';
import {
  CreateDeckRequestDto,
  CreateDeckResponseDto,
} from './dto/create-deck.dto';
import { OpenDeckRequestDto, OpenDeckResponseDto } from './dto/open-deck.dto';
import { DrawCardRequestDto, DrawCardResponseDto } from './dto/draw-card.dto';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('/deck/create')
  @HttpCode(201)
  public async createDeck(
    @Body() request: CreateDeckRequestDto,
  ): Promise<CreateDeckResponseDto> {
    return this.cardsService.createDeck(request);
  }

  @Post('/deck/open')
  @HttpCode(200)
  public async openDeck(
    @Body() request: OpenDeckRequestDto,
  ): Promise<OpenDeckResponseDto> {
    return this.cardsService.openDeck(request);
  }

  @Post('/card/draw')
  @HttpCode(200)
  public async drawCard(
    @Body() request: DrawCardRequestDto,
  ): Promise<DrawCardResponseDto> {
    return this.cardsService.drawCard(request);
  }
}
