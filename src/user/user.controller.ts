import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  async getProfile(@CurrentUser('id') id: string) {
    return this.userService.byId(+id);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @HttpCode(200)
  @Put('profile')
  async updateProfile(
    @CurrentUser('id') id: string, 
    @Body() dto: UserDto
  ) {
    return this.userService.updateProfile(+id, dto);
  }

  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite(
    @CurrentUser('id') id: string,
    @Param('productId') productId: string,
  ) {
    return this.userService.toggleFavorite(+id, +productId);
  }
}
