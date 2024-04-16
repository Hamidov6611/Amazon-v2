import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @Get('by-slug/:slug')
  @Auth()
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    return this.categoryService.byId(id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Post()
  async create() {
    return this.categoryService.create();
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: CategoryDto) {
    return this.categoryService.update(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.categoryService.delete(+id);
  }
}
