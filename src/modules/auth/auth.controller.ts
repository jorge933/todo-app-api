import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public-route';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @IsPublic()
  async createUser(@Body() newUser: CreateUserDto) {
    return await this.authenticate('createUser', newUser);
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

    return user;
  }
}
