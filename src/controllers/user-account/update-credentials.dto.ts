import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { convertToLowerCase } from '../../helpers/to-lower-case';

export class UpdateUserCredentials {
  @IsString()
  @MaxLength(10)
  @MinLength(3)
  @IsOptional()
  @Transform(convertToLowerCase)
  username: string;

  @IsEmail()
  @IsOptional()
  @Transform(convertToLowerCase)
  email: string;

  @IsOptional()
  @IsString()
  photo: string;

  constructor(username: string, email: string, photo: string) {
    this.username = username;
    this.email = email;
    this.photo = photo;
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
