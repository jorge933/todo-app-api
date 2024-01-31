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

export class UserAndTeamDto {
  @IsNotEmpty()
  @IsValidUser()
  credential: string;

  @IsNumber()
  @IsValidTeam()
  teamId: number;

  constructor(credential: string, teamId: number) {
    this.credential = credential;
    this.teamId = teamId;
  }
}

export class RemoveUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsValidTeam()
  teamId: number;

  constructor(id: number, teamId: number) {
    this.id = id;
    this.teamId = teamId;
  }
}
