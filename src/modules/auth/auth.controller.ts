import { Body, Controller, Get, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { GetUserId } from './decorators/get-user';
import { IsPublic } from './decorators/is-public-route';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @IsPublic()
  async createUser(@Body() newUser: CreateUserDto) {
    console.log(newUser);
    const user = await this.userService.create(newUser);
    const token = this.jwtService.sign(user);
    return token;
  }

  @Post('login')
  @IsPublic()
  async login(@Body() credentials: LoginUserDto) {
    const user = await this.userService.login(credentials);
    const token = this.jwtService.sign(user);
    return token;
  }

  @Get()
  test(@GetUserId() userId: string) {
    const user = this.userService.findOne(userId);
    return user;
  }
}
