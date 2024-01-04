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
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    UnitOfWorkModule,
  ],
  controllers: [TasksController, UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TasksService,
    UserService,
  ],
})
export class AppModule {}
