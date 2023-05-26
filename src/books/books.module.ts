import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  imports: [PrismaModule]
})
export class BooksModule { }
