import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule, // 导入 AuthModule 以使用 AuthService
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
