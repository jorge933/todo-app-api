import { Module } from '@nestjs/common';

import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';

import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';

import { Task, TaskSchema } from '../../schemas/task.schema';
import { User, UserSchema } from '../../schemas/user.schema';

import { DomainErrorsService } from './domain-errors/domain-errors.service';
import { UnitOfWorkService } from './unit-of-work.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Task.name,
        useFactory: (connection: Connection) => {
          const schema = TaskSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'task_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: (connection: Connection) => {
          const schema = UserSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            id: 'user_counter',
            inc_field: '_id',
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  exports: [
    UnitOfWorkService,
    UserRepository,
    TasksRepository,
    DomainErrorsService,
  ],
  providers: [
    UnitOfWorkService,
    UserRepository,
    TasksRepository,
    DomainErrorsService,
  ],
})
export class UnitOfWorkModule {}
