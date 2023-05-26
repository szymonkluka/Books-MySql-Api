import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) { }
  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({ include: { author: true } });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      include: { author: true },
      where: { id }
    })
  }

  public async create(bookData: CreateBookDTO): Promise<Book> {
    const { authorId, ...bookInfo } = bookData;
    try {
      const createdBook = await this.prismaService.book.create({
        data: {
          ...bookInfo,
          author: { connect: { id: authorId } },
        },
        include: { author: true },
      });

      return createdBook;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Title is already taken');
      } else if (error.code === 'P2016') {
        throw new BadRequestException('Invalid author ID');
      } else if (error.message.includes('foreign key constraint fails')) {
        throw new BadRequestException('Invalid author ID');
      } else {
        throw error;
      }
    }
  }

  public async updateById(id: string, bookData: UpdateBookDTO): Promise<Book> {
    try {
      return await this.prismaService.book.update({
        include: { author: true },
        where: { id },
        data: bookData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Name is already taken');
      }
      throw error;
    }
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({ where: { id } })
  }




}
