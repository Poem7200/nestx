// src/base/base.module.ts
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { BaseService } from './base.service';

@Module({})
export class BaseModule {
  static forFeature(entity: any): DynamicModule {
    return {
      module: BaseModule,
      imports: [TypeOrmModule.forFeature([entity])],
      providers: [
        {
          provide: `${entity.name}Service`,
          useFactory: (repo) => new BaseService(repo),
          inject: [getRepositoryToken(entity)],
        },
      ],
      exports: [`${entity.name}Service`],
    };
  }
}
