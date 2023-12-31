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
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @IsPublic()
  async createUser(@Body() newUser: CreateUserDto) {
    const a = new Date();
    const user = await this.authService.create(newUser);

    if (!user) return;

    const token = this.jwtService.sign(user);

    return token;
  }

  @Post('login')
  @IsPublic()
  async login(@Body() credentials: LoginUserDto) {
    const user = await this.authService.login(credentials);
    const token = this.jwtService.sign(user);
    return token;
  }
}
