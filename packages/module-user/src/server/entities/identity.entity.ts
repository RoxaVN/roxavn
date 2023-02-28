import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { User } from './user.entity';

@Entity()
export class Identity {
  static PASSWORD = 'Password';

  @PrimaryColumn('varchar')
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

  @OneToMany(() => AccessToken, (accessToken) => accessToken.identity)
  accessTokens: Identity[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
