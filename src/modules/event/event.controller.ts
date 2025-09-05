import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';
import type IPaginatedEvents from 'src/common/interfaces/IPaginatedEvents';
import { GetUserEventsDto } from './dto/get-user-events.dto';
import { GetUserEventsWithFiltersDto } from './dto/get-user-events-with-filters.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<void> {
    await this.eventService.createEvent(createEventDto.userId, createEventDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('')
  async getUserEvents(
    @Body() { userId, page, limit }: GetUserEventsDto,
  ): Promise<IPaginatedEvents> {
    return this.eventService.getUserEvents(userId, page, limit);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/search')
  async getUserEventsWithFilters(
    @Body() getUserEventsWithFiltersDto: GetUserEventsWithFiltersDto,
  ): Promise<IPaginatedEvents> {
    return this.eventService.getUserEventsWithFilters(
      getUserEventsWithFiltersDto.userId,
      getUserEventsWithFiltersDto,
    );
  }
}
