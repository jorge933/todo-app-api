import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { TeamRoles } from 'src/enums/team-roles';

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
  credentialOfUserToAdd: string;

  @IsNumber()
  teamId: number;

  constructor(userId: string, teamId: number) {
    this.credentialOfUserToAdd = userId;
    this.teamId = teamId;
  }
}
