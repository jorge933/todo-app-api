import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';

import { AuthModule } from './modules/auth/auth.module';

import { TasksController } from './controllers/tasks/tasks.controller';

import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitOfWorkModule } from './modules/unit-of-work/unit-of-work.module';

import { TasksService } from './services/tasks/tasks.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    UnitOfWorkModule,
  ],
  controllers: [TasksController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TasksService,
  ],
})
export class AppModule {}
