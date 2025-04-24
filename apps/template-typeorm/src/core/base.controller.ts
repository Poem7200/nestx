// src/base/base.controller.ts
import {
  Type,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { BaseService } from './base.service';

export function BaseController<T>(prefix: string): Type<any> {
  @Controller(prefix)
  abstract class AbstractBaseController {
    constructor(protected readonly service: BaseService<T & { id: number }>) {}

    @Get()
    getList() {
      return this.service.findAll();
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
      return this.service.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: any) {
      return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) {
      return this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }

  // 返回一个非抽象类，继承自抽象基类控制器
  return class extends AbstractBaseController {};
}
