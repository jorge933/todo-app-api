import { Test, TestingModule } from '@nestjs/testing';
import { UserDocument } from '../../schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should create user and return user details and token', async () => {
    const newUser: CreateUserDto = {
      username: 'user',
      email: 'test@test.com',
      password: 'user123',
    };

    jest.spyOn(authService, 'createUser').mockResolvedValue({
      token: 'jwt_mock_token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as UserDocument,
    });

    const result = await controller.createUser(newUser);
    const expectedUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    expect(typeof result.token).toBe('string');
    expect(result.user).toEqual(expectedUser);
  });

  it('should login user and return user details and token', async () => {
    const credentials: LoginUserDto = {
      login: 'user',
      password: 'password',
    };

    jest.spyOn(authService, 'login').mockResolvedValue({
      token: 'jwt_mock_token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      } as UserDocument,
    });

    const result = await controller.login(credentials);
    const expectedUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
    };

    expect(typeof result.token).toBe('string');
    expect(result.user).toEqual(expectedUser);
  });
});
