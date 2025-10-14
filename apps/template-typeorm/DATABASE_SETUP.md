# 数据库配置指南

## 1. 环境变量配置

在项目根目录创建环境变量文件：

### .env.development（开发环境）

```env
# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=nestx_user
DB_PASSWORD=nestx_pass
DB_DATABASE=nestx_db
DB_SYNCHRONIZE=true
DB_LOGGING=true

# 应用配置
PORT=3000
```

### .env（生产环境）

```env
# 数据库配置
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=nestx_user
DB_PASSWORD=nestx_pass
DB_DATABASE=nestx_db
DB_SYNCHRONIZE=false  # 生产环境关闭自动同步
DB_LOGGING=false

# 应用配置
PORT=3000
```

## 2. MySQL Docker 容器启动

如果你已经运行了 MySQL Docker 容器，确保配置如下：

```bash
docker run -d \
  --name nestx-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=nestx_db \
  -e MYSQL_USER=nestx_user \
  -e MYSQL_PASSWORD=nestx_pass \
  mysql:8.0
```

查看容器状态：

```bash
docker ps
```

停止容器：

```bash
docker stop nestx-mysql
```

启动已存在的容器：

```bash
docker start nestx-mysql
```

## 3. 安装依赖

确保你使用的是 Node.js 18+ 版本，然后安装依赖：

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

## 4. 启动应用

```bash
# 开发模式
npm run start:dev

# 或者
pnpm start:dev
```

## 5. 测试 API

应用启动后，你可以使用以下 API 端点：

### 创建用户

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 获取所有用户

```bash
curl http://localhost:3000/users
```

### 获取单个用户

```bash
curl http://localhost:3000/users/1
```

### 更新用户

```bash
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser"
  }'
```

### 删除用户

```bash
curl -X DELETE http://localhost:3000/users/1
```

## 6. 项目结构

```
src/
├── entities/           # 数据库实体
│   └── user.entity.ts  # 用户实体
├── users/             # 用户模块
│   ├── dto/           # 数据传输对象
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── users.controller.ts  # 控制器
│   ├── users.service.ts     # 服务层
│   └── users.module.ts      # 模块定义
├── app.module.ts      # 主模块
└── main.ts            # 应用入口
```

## 7. TypeORM 配置说明

### 配置选项解释

- **type**: 数据库类型（mysql, postgres, sqlite 等）
- **host**: 数据库主机地址
- **port**: 数据库端口
- **username**: 数据库用户名
- **password**: 数据库密码
- **database**: 数据库名称
- **entities**: 实体类数组
- **synchronize**: 是否自动同步数据库结构
  - ⚠️ **开发环境**: 设置为 `true`，自动创建/更新表结构
  - ⚠️ **生产环境**: 必须设置为 `false`，使用迁移管理数据库
- **logging**: 是否开启 SQL 日志

### 添加新实体

1. 在 `src/entities/` 目录创建新的实体文件
2. 在 `app.module.ts` 的 `entities` 数组中添加新实体
3. 创建对应的模块、服务和控制器

示例：

```typescript
// src/entities/post.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User)
  author: User;
}
```

## 8. 数据验证

项目已配置全局数据验证管道，使用 `class-validator` 装饰器：

- `@IsNotEmpty()`: 不能为空
- `@IsString()`: 必须是字符串
- `@IsEmail()`: 必须是有效的邮箱
- `@MinLength(n)`: 最小长度
- `@MaxLength(n)`: 最大长度
- `@IsNumber()`: 必须是数字
- `@IsBoolean()`: 必须是布尔值

更多验证器请参考：https://github.com/typestack/class-validator

## 9. 常见问题

### Q: 连接数据库失败？

A: 检查：

- Docker 容器是否正在运行
- 环境变量配置是否正确
- 端口是否被占用

### Q: 表没有自动创建？

A: 确保：

- `DB_SYNCHRONIZE=true` 在开发环境
- 实体已添加到 `app.module.ts` 的 `entities` 数组

### Q: 数据验证不生效？

A: 确保：

- 已安装 `class-validator` 和 `class-transformer`
- DTO 中使用了正确的装饰器
- `main.ts` 中已配置 `ValidationPipe`

## 10. 下一步

- [ ] 添加更多实体和关系
- [ ] 实现用户认证（JWT）
- [ ] 添加数据库迁移
- [ ] 编写单元测试和集成测试
- [ ] 添加 API 文档（Swagger）
