import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/auth.guard';

import { AuthModule } from './modules/auth/auth.module';

import { TasksController } from './controllers/tasks/tasks.controller';

import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UnitOfWorkModule } from './modules/unit-of-work/unit-of-work.module';

import { UserAccountController } from './controllers/user-account/user-account.controller';
import { TasksService } from './services/tasks/tasks.service';
import { UserAccountService } from './services/user-account/user-account.service';
import { ListsController } from './controllers/lists/lists.controller';
import { ListsService } from './services/lists/lists.service';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DB_URI),
    UnitOfWorkModule,
  ],
  controllers: [TasksController, UserAccountController, ListsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    TasksService,
    UserAccountService,
    ListsService,
  ],
})
export class AppModule {}
