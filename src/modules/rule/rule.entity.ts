import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  name: string;

  @Column({ nullable: false, type: 'uuid' })
  companyId: string;

  @Column({ nullable: false, type: 'varchar', length: 100 })
  eventType: string;

  @Column({ nullable: false, type: 'jsonb' })
  conditions: Record<string, unknown>;

  @Column({ nullable: false, type: 'jsonb' })
  actions: Record<string, unknown>;

  @Column({ nullable: false, type: 'boolean', default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
