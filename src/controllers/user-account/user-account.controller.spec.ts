import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountController } from './user-account.controller';
import { UserAccountService } from '../../services/user-account/user-account.service';
import { UpdateUsernameDto, UpdatePasswordDto } from './update-credentials.dto';
import { UNIT_OF_WORK_PROVIDERS } from '../../constants/unit-of-work-providers';

describe('UserAccountController', () => {
  let controller: UserAccountController;
  let userService: UserAccountService;
  let userId: number = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccountController],
      providers: [UserAccountService, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    controller = module.get<UserAccountController>(UserAccountController);
    userService = module.get<UserAccountService>(UserAccountService);
  });

  it('should change username successfully', async () => {
    const newUsername = { username: 'newUsername' };
    const expectedResult = { username: newUsername.username };

    jest
      .spyOn(userService, 'updateUserCredential')
      .mockResolvedValue(expectedResult);

    const result = await controller.changeUsername(userId, newUsername);

    expect(result).toEqual(expectedResult);
  });

  it('should handle error when username is already taken', async () => {
    const existingUsername = 'existingUsername';

    jest
      .spyOn(userService, 'updateUserCredential')
      .mockResolvedValue(undefined);

    const result = await controller.changeUsername(userId, {
      username: existingUsername,
    });

    expect(result).toBeUndefined();
  });

  it('should change password successfully', async () => {
    const newPassword: UpdatePasswordDto = {
      password: 'oldPassword',
      newPassword: 'newPassword',
    };
    const expectedResult = { message: 'Senha atualizada!' };

    jest.spyOn(userService, 'updatePassword').mockResolvedValue(expectedResult);

    const result = await controller.changePassword(userId, newPassword);

    expect(result).toEqual(expectedResult);
  });

  it('should handle error when password is incorrect', async () => {
    const incorrectPassword = 'incorrectPassword';
    const newPassword = 'newPassword';

    jest.spyOn(userService, 'updatePassword').mockResolvedValue(undefined);

    const result = await controller.changePassword(userId, {
      password: incorrectPassword,
      newPassword,
    });

    expect(result).toBeUndefined();
  });
});
