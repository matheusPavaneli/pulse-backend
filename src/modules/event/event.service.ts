import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import type { CreateEventDto } from './dto/create-event-dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  createEvent = async (createEventDto: CreateEventDto): Promise<Event> => {
    const event: Event = this.eventRepository.create({
      ...createEventDto,
      metadata: { ...createEventDto.metadata },
    });
    return this.eventRepository.save(event);
  };

  getUserEvents = async (userId: string): Promise<Event[]> => {
    return this.eventRepository.find({ where: { userId } });
  };
}
