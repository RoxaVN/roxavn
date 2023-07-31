import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';

import { AssetAttribute } from './asset.attribute.entity.js';
import { Store } from './store.entity.js';
import { Unit } from './unit.entity.js';

@Entity()
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  userId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @CreateDateColumn({ type: 'timestamptz' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;

  @OneToMany(() => AssetAttribute, (assetAttributes) => assetAttributes.asset)
  assetAttributes: Relation<AssetAttribute>[];

  @Column('uuid')
  storeId: string;

  @ManyToOne(() => Store, (store) => store.assets)
  store: Relation<Store>;

  @Column('double precision', { default: 1 })
  unitCount: number;

  @Column('bigint')
  unitId: string;

  @ManyToOne(() => Unit, (unit) => unit.assets)
  unit: Relation<Unit>;
}
