import {
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @OneToMany(() => UserIdentity, (identity) => identity.owner)
  identities: UserIdentity[];

  @OneToMany(() => UserAccessToken, (accessToken) => accessToken.owner)
  accessTokens: UserIdentity[];

  @OneToMany(() => UserRole, (role) => role.owner)
  roles: UserRole[];
}
