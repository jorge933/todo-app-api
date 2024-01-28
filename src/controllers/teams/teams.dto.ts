import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { IsValidTeam } from 'src/decorators/exist-team.decorator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class AddUserInTeamDto {
  @IsString()
  @IsNotEmpty()
  @IsValidUser()
  userToAdd: string;

  @IsNumber()
  @IsValidTeam()
  teamId: number;

  constructor(userToAdd: string, teamId: number) {
    this.userToAdd = userToAdd;
    this.teamId = teamId;
  }
}

  @IsNumber()
  teamId: number;

  constructor(userId: string, teamId: number) {
    this.credentialOfUserToAdd = userId;
    this.teamId = teamId;
  }
}
