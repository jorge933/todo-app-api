import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { TeamsService } from '../../services/teams/teams.service';
import { AddUserInTeamDto, CreateTeamDto } from './teams.dto';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post('create')
  async createTeam(@GetUserId() userId: number, @Body() team: CreateTeamDto) {
    return await this.teamsService.createTeam({
      owner: userId,
      name: team.name,
    });
  }

  @Get('')
  getUserTeams(
    @GetUserId() userId: number,
    @Query() queryOptions?: { [key: string]: string },
  ) {
    return this.teamsService.getUserTeams(userId, queryOptions);
  }

  @Post('add-user')
  async addUserInTeam(
    @GetUserId() userId: number,
    @Body() userToAdd: AddUserInTeamDto,
  ) {
    return await this.teamsService.addUserInTeam(userId, userToAdd);
  }
}
