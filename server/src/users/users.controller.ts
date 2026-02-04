import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/minutes')
  async getAvailableMinutes(@Param('id') id: string) {
    const minutes = await this.usersService.getAvailableMinutes(id);
    return { availableMinutes: minutes };
  }

  @Post()
  async createUser(
    @Body() body: { email: string; name?: string; googleId?: string },
  ) {
    return this.usersService.createUser(body.email, body.name, body.googleId);
  }
}
