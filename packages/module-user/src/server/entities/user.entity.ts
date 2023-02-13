import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccessToken } from './user-access-token.entity';
import { UserIdentity } from './user-identity.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ nullable: true })
  email?: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  phone?: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => UserIdentity, (identity) => identity.user)
  identities: UserIdentity[];

  @OneToMany(() => UserAccessToken, (accessToken) => accessToken.user)
  accessTokens: UserIdentity[];

  @OneToMany(() => UserRole, (role) => role.user)
  roles: UserRole[];
}
