import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessToken } from './access-token.entity';
import { Identity } from './identity.entity';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => Identity, (identity) => identity.user)
  identities: Identity[];

  @OneToMany(() => AccessToken, (accessToken) => accessToken.user)
  accessTokens: Identity[];

  @OneToMany(() => UserRole, (role) => role.user)
  roles: UserRole[];
}
