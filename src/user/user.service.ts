import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnUserObject } from './return-user.object';
import { Prisma } from '@prisma/client';
import { UserDto } from './user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async byId(userId: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        ...returnUserObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        ...selectObject
      },
    });

    if(!user) throw new Error('User not found');

    return user;
  }

  async updateProfile(userId: number, dto: UserDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      },
    });

    if(isSameUser && isSameUser.id !== userId) throw new Error('Email already exists');

    const user = await this.byId(userId);

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await argon2.hash(dto.password) : user.password
      }
    })
  }

  async toggleFavorite(userId: number, productId: number) {
    const user = await this.byId(userId);

    if(!user) throw new Error('User not found');

    const isExist = user.favorites.some(favorite => favorite.id === productId);

    if(isExist) {
      await this.prisma.user.update({
        where: {
          id: userId
        },
        data: {
          favorites: {
            [isExist ? 'disconnect' : 'connect']: {
              id: productId
            }
          }
        }
      })
    }

    return {message: "Success"};
  }
}
