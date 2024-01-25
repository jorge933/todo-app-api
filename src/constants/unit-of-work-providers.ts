import { getModelToken } from '@nestjs/mongoose';

import { UnitOfWorkService } from '../modules/unit-of-work/unit-of-work.service';
import { DomainErrorsService } from '../services/domain-errors/domain-errors.service';

import { TasksRepository } from '../repositories/tasks/tasks.repository';
import { TeamMembersRepository } from '../repositories/team-members/team-members.repository';
import { TeamsRepository } from '../repositories/teams/teams.repository';
import { UserRepository } from '../repositories/user/user.repository';

import { Task } from '../schemas/task.schema';
import { TeamMember } from '../schemas/team-members.schema';
import { Team } from '../schemas/team.schema';
import { User } from '../schemas/user.schema';

export const UNIT_OF_WORK_PROVIDERS = [
  UnitOfWorkService,
  UserRepository,
  TasksRepository,
  TeamsRepository,
  TeamMembersRepository,
  DomainErrorsService,
  { provide: getModelToken(User.name), useValue: jest.fn() },
  { provide: getModelToken(Task.name), useValue: jest.fn() },
  { provide: getModelToken(Team.name), useValue: jest.fn() },
  { provide: getModelToken(TeamMember.name), useValue: jest.fn() },
];
