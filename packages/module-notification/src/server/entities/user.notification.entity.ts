import { Column, Entity, PrimaryColumn, ManyToOne } from 'typeorm';

import { Notification } from './notification.entity';

@Entity()
export class UserNotification {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  notificationId: string;

  @ManyToOne(() => Notification)
  notification: Notification;

  @Column({ type: 'timestamptz', nullable: true })
  readDate?: Date;
}
