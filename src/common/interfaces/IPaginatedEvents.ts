import type { Event } from 'src/modules/event/event.entity';

export default interface IPaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  limit: number;
}
