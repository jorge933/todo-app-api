import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';
import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';

@Injectable()
export class UnitOfWorkService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly tasksRepository: TasksRepository,
    public readonly domainErrorsService: DomainErrorsService,
  ) {}
}
