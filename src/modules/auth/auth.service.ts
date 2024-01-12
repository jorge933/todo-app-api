import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpErrors } from 'src/enums/http-erros.enum';
import { UserRepository } from '../../repositories/user/user.repository';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  userRepository: UserRepository;
  constructor(
    private readonly unitOfWork: UnitOfWorkService,
    private readonly jwtService: JwtService,
  ) {}

  async create(user: CreateUserDto) {
    const existUser = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    });

    if (existUser) {
      this.unitOfWork.domainErrorsService.addError(
        'Estas Credenciais já foram registradas no banco!',
        HttpErrors.ALREADY_BEEN_REGISTERED,
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const password = await bcrypt.hash(user.password, 10);

    const userCreated = await this.unitOfWork.userRepository.create({
      ...user,
      password,
    });

    const id = userCreated._id.toString();
    const token = this.generateToken(id);
    const { username, email } = userCreated;
    const userInfos = { username, email };

    return { token, user: userInfos };
  }

  async login(credentials: LoginUserDto) {
    const user = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: credentials.login }, { username: credentials.login }],
    });

    const pass = user?.password ?? '';

    const equalPasswords = await bcrypt.compare(credentials.password, pass);

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.unitOfWork.domainErrorsService.addError(
        'Credenciais inválidas!',
        HttpErrors.INVALID_CREDENTIALS,
        HttpStatus.FORBIDDEN,
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
