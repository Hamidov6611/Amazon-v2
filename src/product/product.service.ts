import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  productReturnObject,
  productReturnObjectFullest,
} from './return-product.object';
import { ProductDto } from './dto/product.dto';
import { generateSlug } from 'src/utils/generate-slug';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginaService: PaginationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) prismaSort.push({ price: 'asc' });
    else if (sort === EnumProductSort.HIGH_PRICE)
      prismaSort.push({ price: 'desc' });
    else if (sort === EnumProductSort.NEWEST)
      prismaSort.push({ createdAt: 'desc' });
    else if (sort === EnumProductSort.OLDEST)
      prismaSort.push({ createdAt: 'asc' });

    const products = await this.prisma.product.findMany({
      where: {
        name: {
          contains: searchTerm,
        },
      },
      orderBy: prismaSort,
    });

    return products;
  }

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async update(id: number, dto: ProductDto) {
    const { categoryId, images, name, price, description } = dto;

    return this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        images,
        name,
        price,
        description,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async byCategory(categorySlug: string) {
    const product = await this.prisma.product.findMany({
      where: {
        slug: categorySlug,
      },
      select: productReturnObjectFullest,
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct) throw new NotFoundException('Product not found');

    const product = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.category.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: productReturnObjectFullest,
    });

    return product;
  }

  async create() {
    return this.prisma.product.create({
      data: {
        description: '',
        name: '',
        price: 0,
        slug: '',
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: {
        id: id,
      },
    });
  }
}
