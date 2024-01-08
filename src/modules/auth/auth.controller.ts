import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public-route';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  @IsPublic()
  async createUser(@Body() newUser: CreateUserDto) {
    return await this.authenticate('create', newUser);
  }

  @Post('login')
  @IsPublic()
  async login(@Body() credentials: LoginUserDto) {
    return await this.authenticate('login', credentials);
  }

  async authenticate(
    methodToCall: string,
    credentials: CreateUserDto | LoginUserDto,
  ) {
    const user = await this.authService[methodToCall](credentials);

    if (!user?.id) return;

    const token = this.jwtService.sign(user);

    return token;
  }
}
