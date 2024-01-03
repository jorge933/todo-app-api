import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../repositories/user/user.repository';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  userRepository: UserRepository;
  constructor(private unitOfWork: UnitOfWorkService) {}

  async create(user: CreateUserDto) {
    const existUser = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: user.email }, { username: user.username }],
    });

    if (existUser) {
      this.unitOfWork.domainErrorsService.addError({
        message: 'Estas Credenciais já foram registradas no banco!',
      });
      return;
    }

    const password = await bcrypt.hash(user.password, 10);

    const userCreated = await this.unitOfWork.userRepository.create({
      ...user,
      password,
    });

    const id = userCreated._id.toString();

    return { id };
  }

  async login(credentials: LoginUserDto) {
    const user = await this.unitOfWork.userRepository.findOne({
      $or: [{ email: credentials.login }, { username: credentials.login }],
    });

    const pass = user?.password ?? '';

    const equalPasswords = await bcrypt.compare(credentials.password, pass);

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.unitOfWork.domainErrorsService.addError({
        message: 'Credenciais inválidas!',
      });
      return;
    }

    const id = user._id.toString();

    return { id };
  }
}
