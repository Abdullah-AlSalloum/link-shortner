import { User } from './user.entity';
import { Guest } from './guest.entity';
import { Analytics } from './analytics.entity';
export declare class Link {
    id: string;
    originalUrl: string;
    shortCode: string;
    userId: string;
    guestId: string;
    user: User;
    guest: Guest;
    analytics: Analytics[];
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}
