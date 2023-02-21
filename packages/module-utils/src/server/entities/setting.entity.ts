import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['module', 'name'], { unique: true })
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  metadata: any;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
