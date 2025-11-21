import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [
    // 配置 JWT 模块
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        return {
          secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
          signOptions: {
            algorithm: 'HS256',
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
