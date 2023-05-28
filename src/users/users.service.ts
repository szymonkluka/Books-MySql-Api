import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { User, Password } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) { }

  public getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public getById(id: string): Promise<User | null> {
    return this.prismaService.user.findUnique({ where: { id } });
  }

  public async getByEmail(
    email: User['email'],
  ): Promise<(User & { password: Password }) | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async create(
    userData: Omit<User, 'id'>,
    password: string,
  ): Promise<User> {
    try {
      return await this.prismaService.user.create({
        data: {
          ...userData,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  public async updateById(
    id: User['id'],
    userData: Omit<User, 'id' | 'email' | 'password'>,
    password?: string,
  ): Promise<User> {
    if (password) {
      return await this.prismaService.user.update({
        where: { id },
        data: {
          ...userData,
          password: {
            update: {
              hashedPassword: password,
            },
          },
        },
      });
    } else {
      return await this.prismaService.user.update({
        where: { id },
        data: userData,
      });
    }
  }

  public async deleteById(id: string): Promise<void> {
    const deletedUser = await this.prismaService.user.delete({
      where: { id },
    });
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
  }

}