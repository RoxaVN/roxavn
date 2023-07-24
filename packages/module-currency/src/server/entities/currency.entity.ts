import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column('varchar', { length: 64 })
  symbol: string;

  @Column('varchar', { length: 64 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: any;
}
