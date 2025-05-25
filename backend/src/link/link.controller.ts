import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LinkService } from './link.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserLinks(@Request() req) {
    return this.linkService.getUserLinks(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createLink(@Request() req, @Body() createLinkDto: CreateLinkDto) {
    return this.linkService.createLink(req.user.userId, createLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getLink(@Request() req, @Param('id') id: string) {
    return this.linkService.getLink(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateLink(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    return this.linkService.updateLink(req.user.userId, id, updateLinkDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteLink(@Request() req, @Param('id') id: string) {
    return this.linkService.deleteLink(req.user.userId, id);
  }
}
