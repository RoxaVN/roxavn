---
to: src/server/entities/<%= h.changeCase.dot(entity_name) %>.entity.ts
---
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class <%= h.changeCase.pascal(entity_name) %> {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('uuid')
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
