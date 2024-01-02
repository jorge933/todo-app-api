import { Module } from '@nestjs/common';

import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';

import { UnitOfWorkService } from './unit-of-work.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { Task, TaskSchema } from '../../schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  exports: [UnitOfWorkService, UserRepository, TasksRepository],
  providers: [UnitOfWorkService, UserRepository, TasksRepository],
})
export class UnitOfWorkModule {}
