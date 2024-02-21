import { Module } from '@nestjs/common';

import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/users/users.repository';

import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from '../../schemas/task.schema';
import { User, UserSchema } from '../../schemas/user.schema';

import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { generateSchemaImport } from './functions/generate-schema-import';
import { UnitOfWorkService } from './unit-of-work.service';
import { ListsRepository } from 'src/repositories/lists/lists.repository';
import { List, ListSchema } from 'src/schemas/list.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      generateSchemaImport(User.name, UserSchema, {
        id: 'user_counter',
        inc_field: '_id',
      }),
      generateSchemaImport(Task.name, TaskSchema, {
        id: 'task_counter',
        inc_field: '_id',
      }),
      generateSchemaImport(List.name, ListSchema, {
        id: 'list_counter',
        inc_field: '_id',
      }),
    ]),
  ],
  exports: [
    UnitOfWorkService,
    UserRepository,
    TasksRepository,
    DomainErrorsService,
    ListsRepository,
  ],
  providers: [
    UnitOfWorkService,
    UserRepository,
    TasksRepository,
    DomainErrorsService,
    ListsRepository,
  ],
})
export class UnitOfWorkModule {}
