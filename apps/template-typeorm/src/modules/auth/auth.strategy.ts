import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload extends BaseJwtPayload {
  id: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // 从请求头中提取 JWT token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 是否忽略过期时间
      ignoreExpiration: false,
      // JWT 密钥
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  /**
   * JWT 验证成功后调用此方法
   * @param payload JWT payload（包含 id 和 username）
   * @returns 返回 payload，会被注入到请求对象中
   */
  validate(payload: JwtPayload): JwtPayload {
    // 返回 payload，可以通过 @Request() req.user 访问
    return payload;
  }
}
