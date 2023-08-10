import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { type SettingType } from '../../base/index.js';

@Entity()
@Index(['module', 'name'], { unique: true })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character varying')
  module: string;

  @Column('character varying')
  name: string;

  @Column({ type: 'varchar' })
  type: SettingType;

  @Column({ type: 'jsonb' })
  metadata: Record<string, any>;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
