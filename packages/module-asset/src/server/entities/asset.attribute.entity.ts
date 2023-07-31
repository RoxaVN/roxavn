import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Asset } from './asset.entity.js';
import { Attribute } from './attribute.entity.js';

@Entity()
export class AssetAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  assetId: string;

  @ManyToOne(() => Asset, (asset) => asset.assetAttributes, {
    onDelete: 'CASCADE',
  })
  asset: Relation<Asset>;

  @Column('bigint')
  attributeId: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.assetAttributes)
  attribute: Relation<Attribute>;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  valueDate?: Date;

  @Column({ type: 'bigint', nullable: true })
  valueInt?: number;

  @Column({ type: 'decimal', length: 12, precision: 4, nullable: true })
  valueDecimal?: number;

  @Column({ type: 'text', nullable: true })
  valueText?: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  valueVarchar?: string;
}
