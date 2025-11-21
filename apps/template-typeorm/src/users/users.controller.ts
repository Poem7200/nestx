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
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../modules/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // 查找用户
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成 JWT token（使用 id 和 username 作为 payload）
    const payload = {
      id: user.id,
      username: user.username,
    };

    return this.authService.generateToken(payload);
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
