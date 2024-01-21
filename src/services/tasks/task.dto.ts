import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(15)
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class DeleteTaskDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

export class EditTaskNameDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(1)
  @MaxLength(15)
  newName: string;

  constructor(id: number, newName: string) {
    this.id = id;
    this.newName = newName;
  }
}
