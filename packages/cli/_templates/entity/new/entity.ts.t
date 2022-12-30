---
to: src/server/entities/<%= h.inflection.underscore(entity_name).replaceAll('_', '.') %>.entity.ts
---
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '@roxavn/module-user/server';

@Entity()
export class <%= h.capitalize(entity_name) %> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (owner) => owner.identities)
  owner: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
