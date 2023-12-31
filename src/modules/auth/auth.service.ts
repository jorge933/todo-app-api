import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { DomainErrorsService } from 'src/services/domain-errors/domain-errors.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly domainErrorsService: DomainErrorsService,
  ) {}

  async create(user: CreateUserDto) {
    const existUser = await this.userModel
      .findOne({
        $or: [{ email: user.email }, { username: user.username }],
      })
      .exec();

    if (existUser) {
      this.domainErrorsService.addError({
        message: 'Estas Credenciais já foram registradas no banco!',
      });
      return;
    }

    const password = await bcrypt.hash(user.password, 10);

    const userCreated = new this.userModel({
      ...user,
      password,
      tasks: [],
    });

    userCreated.save();

    const id = userCreated._id.toString();

    return { id };
  }

  async login(credentials: LoginUserDto) {
    const user = await this.userModel.findOne({
      $or: [{ email: credentials.login }, { username: credentials.login }],
    });

    const equalPasswords = await bcrypt.compare(
      credentials.password,
      user?.password,
    );

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.domainErrorsService.addError({ message: 'Credenciais inválidas!' });
    }

    const id = user._id.toString();

    return { id };
  }
}
