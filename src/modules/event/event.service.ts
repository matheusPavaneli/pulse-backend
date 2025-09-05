import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import type { CreateEventDto } from './dto/create-event.dto';
import type IPaginatedEvents from 'src/common/interfaces/IPaginatedEvents';
import type { GetUserEventsWithFiltersDto } from './dto/get-user-events-with-filters.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  createEvent = async (
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<Event> => {
    const event: Event = this.eventRepository.create({
      ...createEventDto,
      userId: userId,
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

  getUserEventsWithFilters = async (
    userId: string,
    filters: GetUserEventsWithFiltersDto,
  ): Promise<IPaginatedEvents> => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const qb = this.eventRepository
      .createQueryBuilder('event')
      .where('event.userId = :userId', { userId });

    if (filters.type) {
      qb.andWhere('event.type = :type', { type: filters.type });
    }

    if (filters.service) {
      qb.andWhere(`event.metadata ->> 'service' = :service`, {
        service: filters.service,
      });
    }

    if (filters.severity) {
      qb.andWhere(`event.metadata ->> 'severity' = :severity`, {
        severity: filters.severity,
      });
    }

    if (filters.reason) {
      qb.andWhere(`event.payload ->> 'reason' ILIKE :reason`, {
        reason: `%${filters.reason}%`,
      });
    }

    if (filters.fromDate) {
      qb.andWhere('event.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }

    if (filters.toDate) {
      qb.andWhere('event.createdAt <= :toDate', { toDate: filters.toDate });
    }

    qb.orderBy('event.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { events: data, total, page, limit };
  };
}
