import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/users/users.repository';
import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { ListsRepository } from 'src/repositories/lists/lists.repository';

@Injectable()
export class UnitOfWorkService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly tasksRepository: TasksRepository,
    public readonly domainErrorsService: DomainErrorsService,
    public readonly listsRepository: ListsRepository,
  ) {}
}
