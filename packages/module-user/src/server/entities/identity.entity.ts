import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { User } from './user.entity';

@Entity()
@Unique(['subject', 'type'])
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying')
  subject: string;

  @Column('character varying')
  type: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.identities)
  user: User;

  @OneToMany(() => AccessToken, (accessToken) => accessToken.identity)
  accessTokens: Identity[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
