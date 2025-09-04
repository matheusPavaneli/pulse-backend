import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event-dto';
import { EventService } from './event.service';
import type { Event } from './event.entity';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<void> {
    await this.eventService.createEvent(createEventDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get("")
  async getUserEvents(@Body('userId') userId: string): Promise<Event[]> {
    return this.eventService.getUserEvents(userId);
  }
}
