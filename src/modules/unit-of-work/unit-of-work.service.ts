import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';

@Injectable()
export class UnitOfWorkService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly tasksRepository: TasksRepository,
  ) {}
}
