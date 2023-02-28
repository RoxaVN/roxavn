import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  email?: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  phone?: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.identities)
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
