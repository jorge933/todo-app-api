import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { HttpStatus } from '@nestjs/common';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { User, UserDocument } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UnitOfWorkService } from '../unit-of-work/unit-of-work.service';
import * as bcrypt from 'bcrypt';
import { FlattenMaps } from 'mongoose';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let mockUnitOfWorkService: UnitOfWorkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UnitOfWorkService,
          useValue: {
            userRepository: {
              findOne: jest.fn(),
              create: jest.fn(),
            },
            domainErrorsService: {
              addError: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    mockUnitOfWorkService = module.get<UnitOfWorkService>(UnitOfWorkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create user and return token and user details', async () => {
    const newUser: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    };

    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const user: User = {
      id: 1,
      email: newUser.email,
      username: newUser.username,
      password: hashedPassword,
    };
    const expectUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = 'jwt_token';

    jest.spyOn(service, 'create').mockResolvedValue(user as UserDocument);
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await service.createUser(newUser);

    expect(typeof result.token).toBe('string');
    expect(result.user).toEqual(expectUser);
  });

  it('should handle already registered credentials', async () => {
    const newUser: CreateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password',
    };

    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 1,
      ...newUser,
    } as UserDocument);

    await service.createUser(newUser);

    expect(
      mockUnitOfWorkService.domainErrorsService.addError,
    ).toHaveBeenCalledWith(
      {
        message: 'Estas Credenciais já foram registradas no banco!',
        type: HttpTypeErrors.ALREADY_BEEN_REGISTERED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('should login user and return token and user details', async () => {
    const loginUser: LoginUserDto = {
      login: 'testuser',
      password: 'password',
    };

    const hashedPassword = await bcrypt.hash(loginUser.password, 10);

    const user: User = {
      _id: 1,
      email: 'test@example.com',
      username: loginUser.login,
      password: hashedPassword,
    };

    jest.spyOn(service, 'findOne').mockResolvedValue({
      ...user,
      toJSON: (): FlattenMaps<User> => {
        const userJson = { ...user, id: user._id };
        delete userJson._id;
        return userJson as User;
      },
    } as UserDocument);

    jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

    const result = await service.login(loginUser);

    expect(typeof result.token).toBe('string');
    expect(result.user).toEqual({
      id: user._id,
      email: user.email,
      username: user.username,
    });
  });

  it('should handle invalid credentials', async () => {
    const loginUser: LoginUserDto = {
      login: 'testuser',
      password: 'password',
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(null);

    await service.login(loginUser);

    expect(
      mockUnitOfWorkService.domainErrorsService.addError,
    ).toHaveBeenCalledWith(
      {
        message: 'Credenciais inválidas!',
        type: HttpTypeErrors.INVALID_CREDENTIALS,
      },
      HttpStatus.UNAUTHORIZED,
    );
  });
});
