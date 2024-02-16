import { getModelToken } from '@nestjs/mongoose';

import { UnitOfWorkService } from '../modules/unit-of-work/unit-of-work.service';
import { DomainErrorsService } from '../services/domain-errors/domain-errors.service';

import { TasksRepository } from '../repositories/tasks/tasks.repository';
import { UserRepository } from '../repositories/user/user.repository';

import { Task } from '../schemas/task.schema';
import { User } from '../schemas/user.schema';

export const UNIT_OF_WORK_PROVIDERS = [
  UnitOfWorkService,
  UserRepository,
  TasksRepository,
  DomainErrorsService,
  { provide: getModelToken(User.name), useValue: jest.fn() },
  { provide: getModelToken(Task.name), useValue: jest.fn() },
];
