import { INestApplication } from '@nestjs/common';

export function setCors(app: INestApplication) {
  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'content-type'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
}
