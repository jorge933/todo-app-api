import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { convertToLowerCase } from 'src/helpers/to-lower-case';

export class CreateUserDto {
  @IsEmail()
  @Transform(convertToLowerCase)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @Transform(convertToLowerCase)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
