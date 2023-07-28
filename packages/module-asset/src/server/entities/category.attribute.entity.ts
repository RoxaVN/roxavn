import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity.js';
import { Attribute } from './attribute.entity.js';

@Entity()
@Index(['categoryId', 'attributeId'], { unique: true })
export class CategoryAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('bigint')
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.categoryAttributes)
  category: Relation<Category>;

  @Column('bigint')
  attributeId: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.categoryAttributes)
  attribute: Relation<Attribute>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
