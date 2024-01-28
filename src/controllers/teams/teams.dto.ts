import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { IsValidTeam } from 'src/decorators/exist-team.decorator';
import { IsValidUser } from 'src/decorators/exist-user.decorator';

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

export class PromoteUserRoleDto {
  @IsString()
  @IsNotEmpty()
  userToPromote: string | number;

  @IsNumber()
  teamId: number;

  constructor(userToPromote: string, teamId: number) {
    this.userToPromote = userToPromote;
    this.teamId = teamId;
  }
}
