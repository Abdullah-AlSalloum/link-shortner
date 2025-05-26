import { Link } from './link.entity';
export declare class Analytics {
    id: string;
    linkId: string;
    link: Link;
    clickedAt: Date;
    referrer: string;
    ipAddress: string;
    location: string;
    userAgent: string;
}
