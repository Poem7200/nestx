import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('list')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('detail')
  findOne(@Query('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const existsByUsername = await this.usersService.findByUsername(createUserDto.username);
    if (existsByUsername) {
      throw new BadRequestException('用户名已存在');
    }

    const existsByEmail = await this.usersService.findByEmail(createUserDto.email);
    if (existsByEmail) {
      throw new BadRequestException('邮箱已存在');
    }

    await this.usersService.create(createUserDto);
    return true;
  }

  @Patch('update/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('change-password/:id')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(id, changePasswordDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
