import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { TeamsService } from '../../services/teams/teams.service';
import { UserAndTeamDto, CreateTeamDto, RemoveUserDto } from './teams.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post('create')
  async createTeam(
    @GetUserId() userId: number,
    @Body() { name }: CreateTeamDto,
  ) {
    const teamCreated = await this.teamsService.createTeam(userId, name);
    return teamCreated;
  }

  @Get('')
  async getUserTeams(
    @GetUserId() userId: number,
    @Query() queryOptions: { [key: string]: string },
  ) {
    const teams = await this.teamsService.getUserTeams(userId, queryOptions);
    return teams;
  }

  @Post('user/add')
  async addUserInTeam(
    @GetUserId() userId: number,
    @Body() userToAddAndTeam: UserAndTeamDto,
  ) {
    const userAdded = await this.teamsService.addUserInTeam(
      userId,
      userToAddAndTeam,
    );
    return userAdded;
  }

  @Post('user/promote')
  async promoteUser(
    @GetUserId() userId: number,
    @Body() userToPromoteAndTeam: UserAndTeamDto,
  ) {
    const userPromoted = await this.teamsService.promoteUserRole(
      userId,
      userToPromoteAndTeam,
    );
    return userPromoted;
  }

  @Post('user/remove')
  async removeUser(
    @GetUserId() userId: number,
    @Body() userToRemoveAndTeam: RemoveUserDto,
  ) {
    const userRemoved = await this.teamsService.removeUser(
      userId,
      userToRemoveAndTeam,
    );
    return userRemoved;
  }
}
