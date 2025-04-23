import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionFilter } from 'src/common/filters/all-exception.filter';
import { setCors } from 'src/common/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.useGlobalFilters(new AllExceptionFilter());

  setCors(app);

  await app.listen(port);
}
bootstrap();
