import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum Plan {
  FREE = 'free',
  TRIAL = 'trial',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({
    type: 'enum',
    enum: Plan,
    default: 'free',
  })
  plan: Plan;

  @Column({ type: 'timestamp', nullable: true })
  trialEndsAt: Date | null;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
