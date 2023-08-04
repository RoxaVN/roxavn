import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['key', 'lang'], { unique: true })
export class Translation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256 })
  key: string;

  @Column({ type: 'varchar', length: 16 })
  lang: string;

  @Column('text')
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
