import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.strategy';
import { ConfigService } from '@nestjs/config';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 生成 JWT token
   * @param payload JWT payload（包含 id 和 username）
   * @returns JWT token
   */
  generateToken(payload: JwtPayload): LoginResponse {
    // TODO: 这里的过期时间应该从配置中读取
    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      access_token,
      refresh_token,
    };
  }
}
