import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IsPublic } from './decorators/is-public-route';
import { LoginUserDto } from './dto/login.dto';
import { GetUserId } from './decorators/get-user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Put()
  @IsPublic()
  async createUser(@Body() newUser: CreateUserDto) {
    const user = await this.userService.create(newUser);
    const token = this.jwtService.sign(user);
    return token;
  }

  @Post()
  @IsPublic()
  async login(@Body() credentials: LoginUserDto) {
    const user = await this.userService.login(credentials);
    const token = this.jwtService.sign(user);
    return token;
  }

  @Get()
  test(@GetUserId() userId: string) {
    const user = this.userService.sla(userId);
    return user;
  }
}
