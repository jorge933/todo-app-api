import { Module } from '@nestjs/common';

import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';

import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from '../../schemas/task.schema';
import { User, UserSchema } from '../../schemas/user.schema';

import { DomainErrorsService } from './domain-errors/domain-errors.service';
import { generateSchemaImport } from './functions/generate-schema-import';
import { UnitOfWorkService } from './unit-of-work.service';
import { Team, TeamSchema } from 'src/schemas/team.schema';
import { TeamsRepository } from 'src/repositories/teams/teams.repository';

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

      generateSchemaImport(Team.name, TeamSchema, {
        id: 'teams_counter',
        inc_field: '_id',
      }),

      generateSchemaImport(TeamMember.name, TeamMemberSchema),
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
