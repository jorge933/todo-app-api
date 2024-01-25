import { Injectable } from '@nestjs/common';
import { Team } from '../../schemas/team.schema';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { BaseService } from '../base/base.service';
import { TeamRoles } from '../../enums/team-roles';

@Injectable()
export class TeamsService extends BaseService<Team> {
  constructor(private unitOfWork: UnitOfWorkService) {
    super(unitOfWork.teamsRepository);
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
}
