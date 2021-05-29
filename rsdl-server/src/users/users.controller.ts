import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { CreateUserDto } from './Dtos/user.dto';
import { User, UserDocument } from './schema/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get('/whoAmI')
  @UseGuards(AuthGuard)
  whoAmI(@Body('currentUser') currentUser: User): User {
    return currentUser;
  }
}
