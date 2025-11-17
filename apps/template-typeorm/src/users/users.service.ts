import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 使用 argon2 对密码进行哈希处理
    const hashedPassword = await argon2.hash(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    // 只更新用户基本信息，不处理密码
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  /**
   * 验证密码（用于登录验证）
   * @param plainPassword 明文密码
   * @param hashedPassword 哈希后的密码
   * @returns 密码是否匹配
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, plainPassword);
  }

  /**
   * 修改用户密码
   * @param id 用户ID
   * @param changePasswordDto 包含旧密码和新密码的DTO
   * @returns 是否成功
   */
  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<boolean> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 验证旧密码
    const isOldPasswordValid = await this.validatePassword(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isOldPasswordValid) {
      throw new UnauthorizedException('旧密码不正确');
    }

    // 哈希新密码
    const hashedNewPassword = await argon2.hash(changePasswordDto.newPassword);

    // 更新密码
    await this.userRepository.update(id, { password: hashedNewPassword });
    return true;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
