import { Repository } from 'typeorm';
import { Link } from '../entities/link.entity';
import { Guest } from '../entities/guest.entity';
export declare class UrlService {
    private linkRepository;
    private guestRepository;
    constructor(linkRepository: Repository<Link>, guestRepository: Repository<Guest>);
    private generateShortCode;
    shortenUrl(originalUrl: string, guestId?: string, userId?: string): Promise<Link>;
    getOriginalUrl(shortCode: string): Promise<string | null>;
    getLinksByGuestId(guestId: string): Promise<Link[]>;
    getLinksByUserId(userId: string): Promise<Link[]>;
}
