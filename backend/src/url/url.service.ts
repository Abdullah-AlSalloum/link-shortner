import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../entities/link.entity';
import { Guest } from '../entities/guest.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  /**
   * Generate a unique short code for a URL
   */
  private generateShortCode(): string {
    // Generate a 7-character unique ID
    return nanoid(7);
  }

  /**
   * Create a new shortened URL
   */
  async shortenUrl(originalUrl: string, guestId?: string, userId?: string): Promise<Link> {
    // Generate a unique short code
    const shortCode = this.generateShortCode();
    
    // Create a new link entity
    const link = new Link();
    link.originalUrl = originalUrl;
    link.shortCode = shortCode;
    
    // Associate with user or guest
    if (userId) {
      link.userId = userId;
    } else if (guestId) {
      // Find or create guest
      let guest = await this.guestRepository.findOne({ where: { guestId } });
      
      if (!guest) {
        guest = new Guest();
        guest.guestId = guestId;
        await this.guestRepository.save(guest);
      }
      
      link.guestId = guest.id;
    }
    
    // Save the link
    return this.linkRepository.save(link);
  }

  /**
   * Get the original URL from a short code
   */
  async getOriginalUrl(shortCode: string): Promise<string | null> {
    const link = await this.linkRepository.findOne({ where: { shortCode } });
    return link ? link.originalUrl : null;
  }

  /**
   * Get links by guest ID
   */
  async getLinksByGuestId(guestId: string): Promise<Link[]> {
    const guest = await this.guestRepository.findOne({ 
      where: { guestId },
      relations: ['links']
    });
    
    return guest ? guest.links : [];
  }

  /**
   * Get links by user ID
   */
  async getLinksByUserId(userId: string): Promise<Link[]> {
    return this.linkRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
}
