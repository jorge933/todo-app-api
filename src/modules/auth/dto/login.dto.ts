import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { convertToLowerCase } from 'src/helpers/to-lower-case';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Transform(convertToLowerCase)
  login: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }
}
