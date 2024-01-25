import { Injectable } from '@nestjs/common';
import { TeamMembersRepository } from 'src/repositories/team-members/team-members.repository';
import { TeamRoles } from '../../enums/team-roles';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { Team } from '../../schemas/team.schema';
import { BaseService } from '../base/base.service';
import { Filters, Pagination } from 'src/interfaces/queries';
import { PipelineStage, SortOrder } from 'mongoose';

@Injectable()
export class TeamsService extends BaseService<Team> {
  teamMembersRepository: TeamMembersRepository;

  constructor(private unitOfWork: UnitOfWorkService) {
    super(unitOfWork.teamsRepository);
    this.teamMembersRepository = unitOfWork.teamMembersRepository;
  }

  async createTeam(team: Team) {
    const teamCreated = await this.create(team);
    const teamMembers = await this.unitOfWork.teamMembersRepository.create({
      memberId: team.owner,
      teamId: teamCreated.id,
      role: TeamRoles.OWNER,
    });

    delete teamMembers._id;

    teamCreated.members = [teamMembers];

    return teamCreated;
  }

  async getUserTeams(userId: number, queryOptions?: { [key: string]: string }) {
    const { size, page } = queryOptions;
    const options = this.getAggregateOptions({ size, page });

    delete queryOptions.sort;
    delete queryOptions.page;
    delete queryOptions.size;

    const filters = this.transformFilters(queryOptions, 'team');

    const aggregateOptions = [
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: '_id',
          as: 'team',
        },
      },
      {
        $match: {
          memberId: userId,
        },
      },
      {
        $match: filters,
      },
      {
        $set: { 'team.id': { $sum: '$team._id' } },
      },
      {
        $unset: ['teamId', '_id', 'team._id', 'memberId'],
      },
      ...(options as PipelineStage[]),
    ];

    return await this.teamMembersRepository.aggregate(aggregateOptions);
  }
}
