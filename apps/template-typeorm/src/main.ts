import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'src/filters/all-exceptions.filter';
import { ResponseTransformInterceptor } from 'src/interceptors/response-transform.interceptor';
import { AppModule } from 'src/app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  // 启用全局数据验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动删除DTO中不存在的属性
      forbidNonWhitelisted: true, // 如果有额外属性，抛出错误
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(port);
}

void bootstrap();
