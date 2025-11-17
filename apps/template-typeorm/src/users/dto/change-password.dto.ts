import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString({ message: '旧密码必须是字符串' })
  oldPassword: string;

  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码至少6个字符' })
  newPassword: string;
}
