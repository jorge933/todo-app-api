import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { User } from '../../schemas/user.schema';
import { BaseService } from '../../services/base/base.service';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService extends BaseService<User> {
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly jwtService: JwtService,
  ) {
    super(unitOfWork.userRepository);
  }

  async createUser({ email, username, password }: CreateUserDto) {
    const existUser = await this.findOne({
      $or: [{ email }, { username }],
    });

    if (existUser) {
      this.unitOfWork.domainErrorsService.addError(
        {
          message: 'Estas Credenciais já foram registradas no banco!',
          type: HttpTypeErrors.ALREADY_BEEN_REGISTERED,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const userCreated = await this.create({
      email,
      username,
      password: passwordHashed,
    });

    const token = this.generateToken({ id: userCreated.id });

    delete userCreated.password;

    return { token, user: userCreated };
  }

  async login({ login, password }: LoginUserDto) {
    const user = await this.findOne({
      $or: [{ email: login }, { username: login }],
    });

    const pass = user?.password ?? '';

    const equalPasswords = await bcrypt.compare(password, pass);

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.unitOfWork.domainErrorsService.addError(
        {
          message: 'Credenciais inválidas!',
          type: HttpTypeErrors.INVALID_CREDENTIALS,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const token = this.generateToken({ id: user._id });

    const userJson = user.toJSON();
    delete userJson.password;

    return { token, user: userJson };
  }

  private generateToken(json: Record<string, unknown>) {
    const token = this.jwtService.sign(json);
    return token;
  }
}
