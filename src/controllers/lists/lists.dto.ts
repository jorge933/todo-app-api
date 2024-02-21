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

export class EditListDto extends CreateListDto {
  @IsNumber()
  id: number;

  constructor(id: number, name: string) {
    super(name);
    this.id = id;
  }
}
