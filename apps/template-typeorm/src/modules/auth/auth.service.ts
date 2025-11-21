import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.strategy';

export interface LoginResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 生成 JWT token
   * @param payload JWT payload（包含 id 和 username）
   * @returns JWT token
   */
  generateToken(payload: JwtPayload): LoginResponse {
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
