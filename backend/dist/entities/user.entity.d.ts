import { Link } from './link.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    links: Link[];
}
