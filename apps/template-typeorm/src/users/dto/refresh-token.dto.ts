import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refresh token 不能为空' })
  @IsString({ message: 'refresh token 必须是字符串' })
  refreshToken: string;
}
