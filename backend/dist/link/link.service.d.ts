import { Repository } from 'typeorm';
import { Link } from '../entities/link.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
export declare class LinkService {
    private linkRepository;
    constructor(linkRepository: Repository<Link>);
    getUserLinks(userId: string): Promise<Link[]>;
    createLink(userId: string, createLinkDto: CreateLinkDto): Promise<Link>;
    getLink(userId: string, id: string): Promise<Link>;
    updateLink(userId: string, id: string, updateLinkDto: UpdateLinkDto): Promise<Link>;
    deleteLink(userId: string, id: string): Promise<void>;
}
