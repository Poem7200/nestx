// src/modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseService } from '../../core/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }
}
