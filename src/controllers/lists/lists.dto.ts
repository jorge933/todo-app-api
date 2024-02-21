import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

const minLength = 1;
const maxLength = 8;

export class CreateListDto {
  @MinLength(minLength)
  @MaxLength(maxLength)
  @IsString()
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
