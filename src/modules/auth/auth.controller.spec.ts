import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { UnitOfWorkModule } from '../unit-of-work/unit-of-work.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

fdescribe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '10d' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ _id: new Types.ObjectId() }),
              ),
            login: jest
              .fn()
              .mockImplementation((user: LoginUserDto) =>
                Promise.resolve({ _id: new Types.ObjectId() }),
              ),
          },
        },
      ],
    }).compile();
    authService = app.get<AuthService>(AuthService);
    authController = app.get<AuthController>(AuthController);
  });

  it('should create and return jwt token string', async () => {
    const userDto = {
      username: 'jorge',
      email: 'jorge@gmail.com',
      password: 'jorge',
    };

    const result = await authController.createUser(userDto);

    expect(typeof result).toBe('string');
  });

  it('should return a jwt token string', async () => {
    const userCredentials = {
      login: 'jorge@gmail.com',
      password: 'jorge',
    };

    const result = await authController.login(userCredentials);

    expect(typeof result).toBe('string');
  });
});
