import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';
import { AppModule } from 'src/app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(port);
}

void bootstrap();
