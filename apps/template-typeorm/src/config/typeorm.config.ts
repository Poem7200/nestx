import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getTypeOrmConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.mysql_host,
    port: parseInt(process.env.mysql_port ?? '3306'),
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database,
    retryAttempts: 1,
    retryDelay: 1000,
    synchronize: true,
    autoLoadEntities: true,
    entityPrefix: 'll_',
  };
}
