import { Module } from '@nestjs/common';

import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';

import { MongooseModule } from '@nestjs/mongoose';

import { Task, TaskSchema } from '../../schemas/task.schema';
import { User, UserSchema } from '../../schemas/user.schema';

import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { generateSchemaImport } from './functions/generate-schema-import';
import { UnitOfWorkService } from './unit-of-work.service';
import { Team, TeamSchema } from '../../schemas/team.schema';
import {
  TeamMember,
  TeamMemberSchema,
} from '../../schemas/team-members.schema';
import { TeamsRepository } from '../../repositories/teams/teams.repository';
import { TeamMembersRepository } from '../../repositories/team-members/team-members.repository';

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
    TeamsRepository,
    TeamMembersRepository,
    DomainErrorsService,
  ],
  providers: [
    UnitOfWorkService,
    UserRepository,
    TasksRepository,
    TeamsRepository,
    TeamMembersRepository,
    DomainErrorsService,
  ],
})
export class UnitOfWorkModule {}
