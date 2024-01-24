import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/tasks/tasks.repository';
import { UserRepository } from '../../repositories/user/user.repository';
import { DomainErrorsService } from './domain-errors/domain-errors.service';
import { TeamsRepository } from 'src/repositories/teams/teams.repository';
import { TeamMembersRepository } from 'src/repositories/team-members/team-members.repository';

@Injectable()
export class UnitOfWorkService {
  constructor(
    public readonly userRepository: UserRepository,
    public readonly tasksRepository: TasksRepository,
    public readonly teamsRepository: TeamsRepository,
    public readonly teamMembersRepository: TeamMembersRepository,
    public readonly domainErrorsService: DomainErrorsService,
  ) {}
}
