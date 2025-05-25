import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Link } from './link.entity';
import { Analytics } from './analytics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Guest, Link, Analytics]),
  ],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
