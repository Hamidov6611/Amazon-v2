import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueToken(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verify(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueToken(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser) throw new BadRequestException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.person.firstName(), // `faker.person.firstName()` o'rniga `faker.name.firstName()` ishlatiladi
        avatarPath: faker.image.avatar(),
        phone: faker.string.numeric(10), // Telefon raqamini generatsiya qilish uchun o'zgartirildi
        password: await argon2.hash(dto.password),
      },
    });

    const tokens = await this.issueToken(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private async issueToken(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const isValid = await argon2.verify(user.password, dto.password);

    if (!isValid) throw new BadRequestException('Invalid password');

    return user;
  }
}
