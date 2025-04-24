// src/modules/user/user.controller.ts
import { UserService } from './user.service';
import { User } from './user.entity';
import { BaseController } from '../../core/base.controller';

export class UserController extends BaseController<User>('users') {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  // 如需额外自定义接口，可继续在这里添加，比如：
  // @Get('profile')
  // getProfile() {
  //   return this.userService.findOne(1);
  // }
}
