import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUsernameDto {
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @Transform(({ value: username }) => username.toLowerCase())
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}

export class UpdateEmailDto {
  @IsEmail()
  @Transform(({ value: email }) => email.toLowerCase())
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  newPassword: string;

  constructor(password: string, newPassword: string) {
    this.password = password;
    this.newPassword = newPassword;
  }
}
