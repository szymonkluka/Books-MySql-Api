import { Controller, Get, Post, Put, Delete, Param, ParseUUIDPipe, NotFoundException, Body, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from 'src/books/dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) { }
  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const author = await this.booksService.getById(id);
    if (!author) throw new NotFoundException('Book not found');
    return author;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }


  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Author not found');

    await this.booksService.updateById(id, bookData);
    return { succes: true }
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Order not found');
    await this.booksService.deleteById(id);
    return { success: true };
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async likeBook(@Body() likeData: { bookId: string; userId: string }) {
    const { bookId, userId } = likeData;

    await this.booksService.likeBook(bookId, userId);

    return { success: true };
  }


}
