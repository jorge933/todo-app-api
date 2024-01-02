import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.dto';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ id: new Types.ObjectId() }),
              ),
            login: jest
              .fn()
              .mockImplementation((user: LoginUserDto) =>
                Promise.resolve({ id: new Types.ObjectId() }),
              ),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create and return object with user id', async () => {
    const userDto = {
      username: 'jorge',
      email: 'jorge@gmail.com',
      password: 'jorge',
    };

    const result = (await authService.create(userDto)) as unknown as {
      id: Types.ObjectId;
    };
    const isId = result.id instanceof Types.ObjectId;

    expect(result).toHaveProperty('id');
    expect(isId).toBe(true);
  });

  it('should return object with user id', async () => {
    const userCredentials = {
      login: 'jorge@gmail.com',
      password: 'jorge',
    };

    const result = (await authService.login(userCredentials)) as unknown as {
      id: Types.ObjectId;
    };
    const isId = result.id instanceof Types.ObjectId;

    expect(result).toHaveProperty('id');
    expect(isId).toBe(true);
  });
});
