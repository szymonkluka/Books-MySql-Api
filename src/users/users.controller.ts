import { Controller, Delete, UseGuards, Get, ParseUUIDPipe, Param, NotFoundException, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';


@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService,
    @Inject(PrismaService) private prismaService: PrismaService, // Inject PrismaService
  ) { }
  @Get('/')
  public async getAll(): Promise<User[]> {
    return this.prismaService.user.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const user = await this.usersService.getById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  @Delete('/:id')
  @UseGuards(AdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.usersService.getById(id)))
      throw new NotFoundException('User not found');
    await this.usersService.deleteById(id);
    return { success: true };
  }
}
