import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
