import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Req,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordDto } from './dto/password-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/')
  findAll(@Req() req) {
    const { status, role } = req.query;
    return this.usersService.findAll(status, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/change-password')
  changePassword(@Body() passwordDto: PasswordDto, @Req() req) {
    return this.usersService.changePassword(passwordDto, req?.user?._id);
  }

  @Patch('/:id')
  changeInfo(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.changeInfo(updateUserDto, id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.usersService.remove(id, req?.user?.role);
  }
}
