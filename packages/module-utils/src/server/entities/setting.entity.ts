import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Setting {
  @PrimaryColumn()
  module: string;

  @PrimaryColumn()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedDate: Date;
}
