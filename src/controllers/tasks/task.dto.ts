import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskPriority } from '../../enums/task-priority';

const minLength = 1;
const maxLength = 15;
export class CreateTaskDto {
  @IsString()
  @MinLength(minLength)
  @MaxLength(maxLength)
  name: string;

  @IsEnum(TaskPriority)
  priority: TaskPriority;

  constructor(name: string, priority: TaskPriority) {
    this.name = name;
    this.priority = priority;
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

export class EditTaskDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @MinLength(minLength)
  @MaxLength(maxLength)
  name?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @IsBoolean()
  completed: boolean;

  constructor(name?: string, priority?: TaskPriority, completed?: boolean) {
    this.name = name;
    this.priority = priority;
    this.completed = completed;
  }
}
