import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUserId } from '../../modules/auth/decorators/get-user';
import { TeamsService } from '../../services/teams/teams.service';
import { CreateTeamDto } from './teams.dto';

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
}
