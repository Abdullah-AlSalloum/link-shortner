import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async getUserLinks(userId: string): Promise<Link[]> {
    return this.linkRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async createLink(userId: string, createLinkDto: CreateLinkDto): Promise<Link> {
    const shortCode = createLinkDto.customShortCode || nanoid(7);
    
    // Check if short code already exists
    const existingLink = await this.linkRepository.findOne({
      where: { shortCode },
    });
    
    if (existingLink) {
      throw new ForbiddenException('This short code is already in use');
    }
    
    const link = new Link();
    link.originalUrl = createLinkDto.originalUrl;
    link.shortCode = shortCode;
    link.userId = userId;
    
    if (createLinkDto.expiresAt) {
      link.expiresAt = new Date(createLinkDto.expiresAt);
    }
    
    return this.linkRepository.save(link);
  }

  async getLink(userId: string, id: string): Promise<Link> {
    const link = await this.linkRepository.findOne({
      where: { id },
    });
    
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    
    if (link.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this link');
    }
    
    return link;
  }

  async updateLink(userId: string, id: string, updateLinkDto: UpdateLinkDto): Promise<Link> {
    const link = await this.getLink(userId, id);
    
    if (updateLinkDto.originalUrl) {
      link.originalUrl = updateLinkDto.originalUrl;
    }
    
    if (updateLinkDto.customShortCode) {
      // Check if new short code already exists (except for this link)
      const existingLink = await this.linkRepository.findOne({
        where: { shortCode: updateLinkDto.customShortCode },
      });
      
      if (existingLink && existingLink.id !== id) {
        throw new ForbiddenException('This short code is already in use');
      }
      
      link.shortCode = updateLinkDto.customShortCode;
    }
    
    if (updateLinkDto.expiresAt) {
      link.expiresAt = new Date(updateLinkDto.expiresAt);
    }
    
    return this.linkRepository.save(link);
  }

  async deleteLink(userId: string, id: string): Promise<void> {
    const link = await this.getLink(userId, id);
    await this.linkRepository.remove(link);
  }
}
