import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
