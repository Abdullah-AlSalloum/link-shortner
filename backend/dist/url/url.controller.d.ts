import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Link } from '../entities/link.entity';
export declare class UrlController {
    private readonly urlService;
    constructor(urlService: UrlService);
    shortenUrl(createUrlDto: CreateUrlDto): Promise<Link>;
    getOriginalUrl(shortCode: string): Promise<{
        originalUrl: string;
    }>;
    getLinksByGuestId(guestId: string): Promise<Link[]>;
    getLinksByUserId(userId: string): Promise<Link[]>;
}
