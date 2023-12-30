import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: CreateUserDto) {
    const password = await bcrypt.hash(user.password, 10);

    try {
      const userCreated = await this.userModel.create({
        ...user,
        password,
        tasks: [],
      });

      const id = userCreated._id.toString();

      return { id };
    } catch (error) {
      throw new HttpException(
        'Essas credenciais já foram registradas no banco!',
        HttpStatus.CONFLICT,
      );
    }
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
    if (invalidCredentials)
      throw new HttpException(
        'Credenciais inválidas!',
        HttpStatus.UNAUTHORIZED,
      );

    const id = user._id.toString();

    return { id };
  }

  async findOne(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }
}
