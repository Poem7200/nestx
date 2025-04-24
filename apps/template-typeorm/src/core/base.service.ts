// src/base/base.service.ts
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  DeepPartial,
} from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseService<T extends { id: number }> {
  constructor(protected readonly repo: Repository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repo.find(options);
  }

  async findOne(id: number): Promise<T> {
    // 强制告诉编译器：这里的 where 一定是 T 上的合法条件
    const where = { id } as FindOptionsWhere<T>;
    const entity = await this.repo.findOne({ where });
    if (!entity) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return entity;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T> {
    // TypeORM 的 update 接口接受 Partial<T> 形式的断言
    await this.repo.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
