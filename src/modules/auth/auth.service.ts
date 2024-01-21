import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user/user.repository';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { HttpTypeErrors } from 'src/enums/http-type-errors';

@Injectable()
export class AuthService {
  userRepository: UserRepository;
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateUserDto) {
    const email = user.email.toLowerCase();
    const username = user.username.toLowerCase();

    const existUser = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: email }, { username: username }],
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

    const password = await bcrypt.hash(user.password, 10);

    const userCreated = await this.unitOfWork.userRepository.create({
      email,
      username,
      password,
    });

    const id = userCreated.id.toString();
    const token = this.generateToken(id);

    delete userCreated._id;
    delete userCreated.password;

    return { token, user: userCreated };
  }

  async login(credentials: LoginUserDto) {
    const login = credentials.login.toLowerCase();

    const user = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: login }, { username: login }],
    });

    const pass = user?.password ?? '';

    const equalPasswords = await bcrypt.compare(credentials.password, pass);

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
    const { username, email, photo } = user;
    const userInfos = { username, email, photo };

    return { token, user: userInfos };
  }

  private generateToken(id: string) {
    const token = this.jwtService.sign({ id });
    return token;
  }
}
