import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Link } from './link.entity';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  linkId: string;

  @ManyToOne(() => Link, link => link.analytics)
  @JoinColumn({ name: 'linkId' })
  link: Link;

  @CreateDateColumn()
  clickedAt: Date;

  @Column({ nullable: true })
  referrer: string;

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  userAgent: string;
}
