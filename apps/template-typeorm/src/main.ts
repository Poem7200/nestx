import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setCors } from 'src/common/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  // actually values get from .env file are all string
  const port = configService.get<number>('PORT', 3000);

  // set CORS
  setCors(app);

  await app.listen(port);
}
bootstrap();
