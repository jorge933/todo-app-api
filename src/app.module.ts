import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';

import { AuthModule } from './modules/auth/auth.module';

import { TasksController } from './controllers/tasks/tasks.controller';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitOfWorkModule } from './modules/unit-of-work/unit-of-work.module';

import { TeamsController } from './controllers/teams/teams.controller';
import { UserController } from './controllers/user/user.controller';
import { TasksService } from './services/tasks/tasks.service';
import { TeamsService } from './services/teams/teams.service';
import { UserService } from './services/user/user.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    UnitOfWorkModule,
  ],
  controllers: [TasksController, UserController, TeamsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TasksService,
    UserService,
    TeamsService,
  ],
})
export class AppModule {}
