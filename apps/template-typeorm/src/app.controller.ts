import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // 需引入@nestjs/config，使用 ConfigService 获取环境变量
    // private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    // 环境变量将自动按照顺序读取
    // 1. .env.${process.env.NODE_ENV || 'development'}.local
    // 2. .env.${process.env.NODE_ENV || 'development'}
    // 3. .env.local
    // 4. .env
    return this.appService.getHello();
  }
}
