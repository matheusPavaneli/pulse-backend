import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false, type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ nullable: false, type: 'jsonb' })
  metadata: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}
