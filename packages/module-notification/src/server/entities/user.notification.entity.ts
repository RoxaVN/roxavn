import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';

import { Notification } from './notification.entity.js';

@Entity()
export class UserNotification {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  notificationId: string;

  @ManyToOne(() => Notification)
  notification: Relation<Notification>;

  @Column({ type: 'timestamptz', nullable: true })
  readDate?: Date;
}
