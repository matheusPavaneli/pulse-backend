import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Alert } from '../alert/alert.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  companyId: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false, type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ nullable: false, type: 'jsonb' })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Alert, (alert) => alert.event)
  alerts: Alert[];
}
