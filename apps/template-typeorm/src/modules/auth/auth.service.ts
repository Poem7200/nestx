import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.strategy';
import { ConfigService } from '@nestjs/config';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn = this.resolveExpiresIn('JWT_ACCESS_EXPIRES_IN', 60 * 60 * 8);
    this.refreshTokenExpiresIn = this.resolveExpiresIn('JWT_REFRESH_EXPIRES_IN', 60 * 60 * 24 * 7);
  }

  /**
   * 生成 JWT token
   * @param payload JWT payload（包含 id 和 username）
   * @returns JWT token
   */
  generateToken(payload: JwtPayload): LoginResponse {
    const accessToken = this.jwtService.sign(payload, { expiresIn: this.accessTokenExpiresIn });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });
    const now = Date.now();
    const accessTokenExpiresIn = now + this.accessTokenExpiresIn * 1000;
    const refreshTokenExpiresIn = now + this.refreshTokenExpiresIn * 1000;
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  /**
   * 使用 refresh token 重新获取新的 token
   */
  refreshToken(refreshToken: string): LoginResponse {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const tokens = this.generateToken({
        id: payload.id,
        username: payload.username,
      });
      return tokens;
    } catch {
      throw new UnauthorizedException('refresh token 无效或已过期');
    }
  }

  /**
   * 将配置中的过期时间解析为秒
   */
  private resolveExpiresIn(envKey: string, defaultValue: number): number {
    const value = this.configService.get<string | number>(envKey);
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return defaultValue;
  }
}
