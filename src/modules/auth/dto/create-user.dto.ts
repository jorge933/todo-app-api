import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email.toLowerCase();
    this.username = username.toLowerCase();
    this.password = password;
  }
}
