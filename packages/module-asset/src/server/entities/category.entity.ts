import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryAttribute } from './category.attribute.entity.js';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Index({ unique: true })
  @Column('varchar', { length: 256 })
  name: string;

  @Index()
  @Column('uuid', { nullable: true })
  parentId: string;

  @Column('uuid', { array: true, nullable: true })
  parents?: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(
    () => CategoryAttribute,
    (categoryAttributes) => categoryAttributes.category
  )
  categoryAttributes: Relation<CategoryAttribute>[];
}
