import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user/user.repository';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { HttpTypeErrors } from 'src/enums/http-type-errors';
import { BaseService } from 'src/services/base/base.service';
import { User } from 'src/schemas/user.schema';

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

    const id = userCreated.id.toString();
    const token = this.generateToken(id);

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

    const id = user._id.toString();
    const token = this.generateToken(id);

    const userJson = user.toJSON();
    delete userJson.password;

    return { token, user: userJson };
  }

  private generateToken(id: string) {
    const token = this.jwtService.sign({ id });
    return token;
  }
}
