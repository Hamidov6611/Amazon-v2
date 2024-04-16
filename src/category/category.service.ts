import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CategoryDto } from './category.dto';
import { generateSlug } from 'src/utils/generate-slug';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async byId(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async update(id: number, dto: CategoryDto) {
    return this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async create() {
    return this.prisma.category.create({
      data: {
        name: '',
        slug: '',
      },
    });
  }

   async delete(id: number) {
     return this.prisma.category.delete({
       where: {
         id: id
       }
     })
   }

   async getAll() {
     return this.prisma.category.findMany({
       select: returnCategoryObject
     })
   }

   async bySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        slug: slug,
      },
      select: returnCategoryObject,
    });

    if(!category) throw new NotFoundException('Category not found');

    return category
  }
}
