import { Controller, Post, Body } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateDeckDto, CreateDeckResponseDto } from './dto/create-deck.dto';
import { OpenDeckDto, OpenDeckResponseDto } from './dto/open-deck.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('createDeck')
  async createDeck(
    @Body() createDeckDto: CreateDeckDto,
  ): Promise<CreateDeckResponseDto> {
    console.log(createDeckDto);
    return this.cardsService.createDeck(createDeckDto);
  }

  @Post('openDeck')
  async openDeck(
    @Body() openDeckDto: OpenDeckDto,
  ): Promise<OpenDeckResponseDto> {
    return this.cardsService.openDeck(openDeckDto);
  }

  @Post('drawCard')
  drawCard(): string {
    this.cardsService.drawCard();
    return 'draw';
  }
}
