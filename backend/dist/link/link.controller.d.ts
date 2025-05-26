import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
export declare class LinkController {
    private readonly linkService;
    constructor(linkService: LinkService);
    getUserLinks(req: any): Promise<import("../entities/link.entity").Link[]>;
    createLink(req: any, createLinkDto: CreateLinkDto): Promise<import("../entities/link.entity").Link>;
    getLink(req: any, id: string): Promise<import("../entities/link.entity").Link>;
    updateLink(req: any, id: string, updateLinkDto: UpdateLinkDto): Promise<import("../entities/link.entity").Link>;
    deleteLink(req: any, id: string): Promise<void>;
}
