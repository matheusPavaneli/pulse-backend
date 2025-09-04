import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event-dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<void> {
    await this.eventService.createEvent(createEventDto);
  }
}
