import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Analytics } from './analytics.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortCode: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  guestId: string;

  @ManyToOne(() => User, user => user.links, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Guest, guest => guest.links, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest: Guest;

  @OneToMany(() => Analytics, analytics => analytics.link)
  analytics: Analytics[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}
