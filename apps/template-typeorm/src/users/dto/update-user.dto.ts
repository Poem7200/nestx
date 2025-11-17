import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: '用户名必须是字符串' })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;

  // 注意：不包含 password 字段，密码更新应使用独立的 changePassword 接口
}
