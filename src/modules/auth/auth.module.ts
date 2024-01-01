import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { UnitOfWorkModule } from '../unit-of-work/unit-of-work.module';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    UnitOfWorkModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, DomainErrorsService],
})
export class AuthModule {}
