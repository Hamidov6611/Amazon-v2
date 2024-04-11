import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
    

  app.setGlobalPrefix('api')
  app.enableCors({ origin: /^http:\/\/localhost(:3000|:3001)/ })
  await app.listen(4200);
}
bootstrap();
