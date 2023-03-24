import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(public usersService: UsersService) {}

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);

    return users;
  }

  @Get('/:id')
  findUser(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Post('signup')
  createUser(@Body() body: CreateUserDTO) {
    const { email, password } = body;
    this.usersService.create(email, password);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: Partial<User>) {
    this.usersService.update(id, body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: number) {
    this.usersService.remove(id);
  }
}
