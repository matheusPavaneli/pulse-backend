import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rule } from '../rule/rule.entity';
import { Event } from '../event/event.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Event, { eager: true })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => Rule, { eager: true })
  @JoinColumn({ name: 'ruleId' })
  rule: Rule;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  severity: string;

  @Column({ nullable: false, type: 'varchar', length: 50, default: 'open' })
  status: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'jsonb' })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
