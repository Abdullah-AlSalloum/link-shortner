import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Link } from './link.entity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  guestId: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Link, link => link.guest)
  links: Link[];
}
