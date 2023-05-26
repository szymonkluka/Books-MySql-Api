import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module'; // Add this import statement
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [UsersModule, PassportModule, PrismaModule, UsersModule, JwtModule.registerAsync({
    useFactory: () => ({
      secret: 'xrwe4543534',
      signOptions: {
        expiresIn: '12h',
      },
    }),
  }),] // Include the UsersModule here
})
export class AuthModule { }