import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identity } from './identity.entity';
import { User } from './user.entity';

@Entity()
export class AccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identityType: string;

  @Column()
  token: string;

  @Column('uuid')
  identityId: string;

  @ManyToOne(() => Identity, (identity) => identity.accessTokens)
  identity: Identity;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.accessTokens)
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @Column({ type: 'timestamptz' })
  expiredDate: Date;
}
