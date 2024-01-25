import { Test, TestingModule } from '@nestjs/testing';
import { UserAccountController } from './user-account.controller';
import { UserAccountService } from '../../services/user-account/user-account.service';
import { UNIT_OF_WORK_PROVIDERS } from '../../constants/unit-of-work-providers';
import {
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUsernameDto,
} from './update-credentials.dto';

describe('UsersController', () => {
  let controller: UserAccountController;
  let userAccountService: UserAccountService;

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAccountController],
      providers: [UserAccountService, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    controller = module.get<UserAccountController>(UserAccountController);
    userAccountService = module.get<UserAccountService>(UserAccountService);
  });

  it('should update the username and return the new username', async () => {
    const newUsername = new UpdateUsernameDto('test');

    jest
      .spyOn(userAccountService, 'updateUserCredential')
      .mockReturnValue(Promise.resolve(newUsername));

    expect(newUsername).toEqual(
      await controller.changeUsername(userId, newUsername),
    );
  });

  it('should update the user email and return the new email', async () => {
    const newEmail = new UpdateEmailDto('test@test.com');

    jest
      .spyOn(userAccountService, 'updateUserCredential')
      .mockReturnValue(Promise.resolve(newEmail));

    expect(newEmail).toEqual(await controller.changeEmail(userId, newEmail));
  });

  it('should update the user password and return a message', async () => {
    const newPassword = new UpdatePasswordDto('currentPassword', 'newPassword');
    const expectedMessage = { message: 'Senha atualizada!' };

    jest
      .spyOn(userAccountService, 'updatePassword')
      .mockReturnValue(Promise.resolve(expectedMessage));

    expect(await controller.changePassword(userId, newPassword)).toEqual(
      expectedMessage,
    );
  });
});
