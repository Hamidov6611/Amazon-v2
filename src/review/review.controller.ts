import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(){
    return this.reviewService.getAll()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post("leave/:productId")
  @Auth()
  async leaveReview(
    @CurrentUser('id') id: number,
    @Body() dto: ReviewDto,
    @Param("productId") productId: number
  ){
    return this.reviewService.create(id, dto, +productId)
  }

}
