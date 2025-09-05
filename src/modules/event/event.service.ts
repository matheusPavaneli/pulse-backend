import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import type { CreateEventDto } from './dto/create-event.dto';
import type IPaginatedEvents from 'src/common/interfaces/IPaginatedEvents';

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

  getUserEvents = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedEvents> => {
    const [data, total] = await this.eventRepository
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId })
      .orderBy('event.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { events: data, total, page, limit };
  };
}
