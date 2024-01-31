import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { UserAccountService } from './user-account.service';
import { User, UserDocument } from '../../schemas/user.schema';
import { UserRepository } from '../../repositories/user/user.repository';

describe('UserAccountService', () => {
  let service: UserAccountService;
  let domainErrorsService: DomainErrorsService;
  let mockUserRepository: UserRepository;
  let existingUser: Pick<User, '_id' | 'username' | 'password'>;

  const userId = 1;
  const updateUserDto = { username: 'newusername' };
  const updatePasswordDto = {
    password: 'oldPassword',
    newPassword: 'newPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAccountService,
        {
          provide: UnitOfWorkService,
          useValue: {
            userRepository: {
              findOne: jest.fn(),
            },
            domainErrorsService: {
              addError: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    existingUser = {
      _id: userId,
      username: 'existingUser',
      password: await bcrypt.hash('oldPassword', 10),
    };

    const unitOfWorkService = module.get<UnitOfWorkService>(UnitOfWorkService);

    service = module.get<UserAccountService>(UserAccountService);
    domainErrorsService = unitOfWorkService.domainErrorsService;
    mockUserRepository = unitOfWorkService.userRepository;

    jest.spyOn(service, 'updateOne').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update user credential successfully', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

    const result = await service.updateUserCredential(userId, updateUserDto);

    expect(result).toEqual(updateUserDto);
  });

  it('should handle already registered credential', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValueOnce(existingUser as UserDocument);

    await service.updateUserCredential(userId, updateUserDto);

    expect(domainErrorsService.addError).toHaveBeenCalledWith(
      {
        message: `Este username já foi registrado!`,
        type: HttpTypeErrors.ALREADY_BEEN_REGISTERED,
      },
      HttpStatus.UNAUTHORIZED,
    );
  });

  it('should update user password successfully', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(existingUser as UserDocument);

    const result = await service.updatePassword(userId, updatePasswordDto);

    expect(result).toEqual({ message: 'Senha atualizada!' });
  });

  it('should handle invalid credentials when updating password', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

    await service.updatePassword(userId, updatePasswordDto);

    expect(domainErrorsService.addError).toHaveBeenCalledWith(
      {
        message: 'Credenciais inválidas!',
        type: HttpTypeErrors.INVALID_CREDENTIALS,
      },
      HttpStatus.UNAUTHORIZED,
    );
  });
});
