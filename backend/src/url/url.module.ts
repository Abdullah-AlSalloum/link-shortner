import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../entities/link.entity';
import { Guest } from '../entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Guest])],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
