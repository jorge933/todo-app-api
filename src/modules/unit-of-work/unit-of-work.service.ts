import { Injectable } from '@nestjs/common';
import { TasksRepository } from 'src/repositories/tasks/tasks.repository';
import { UserRepository } from 'src/repositories/user/user.repository';

@Injectable()
export class UnitOfWorkService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly tasksRepository: TasksRepository,
  ) {}
}
