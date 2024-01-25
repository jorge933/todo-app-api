import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/schemas/user.schema';
import { UNIT_OF_WORK_PROVIDERS } from '../../constants/unit-of-work-providers';
import { UserAccountService } from './user-account.service';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

type UserPromise = Promise<
  Document<any, {}, User> & User & Required<{ _id: number }>
>;

describe('UserService', () => {
  let service: UserAccountService;
  let credentials: User;

  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccountService, ...UNIT_OF_WORK_PROVIDERS],
    }).compile();

    service = module.get<UserAccountService>(UserAccountService);
    credentials = {
      id: 2,
      username: 'jorge',
      email: 'jorge@gmeail.com',
      password: await bcrypt.hash('jorge', 10),
    };

    jest.spyOn(service, 'updateOne').mockImplementation(jest.fn());
  });

  it('should update user credential and return the new value', async () => {
    const newUsername = { username: 'test' };

    jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(null));

    expect(newUsername).toEqual(
      await service.updateUserCredential(userId, newUsername),
    );
  });

  it('should not update the username and return undefined', async () => {
    const newUsername = { username: 'test' };

    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(credentials) as UserPromise);

    const expectedReturn = undefined;

    expect(expectedReturn).toBe(
      await service.updateUserCredential(userId, newUsername),
    );
  });

  it('should update the user password and return success message', async () => {
    const newPassword = { password: 'jorge', newPassword: 'jorgee' };

    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(credentials) as UserPromise);

    const expectedReturn = { message: 'Senha atualizada!' };

    expect(expectedReturn).toEqual(
      await service.updatePassword(userId, newPassword),
    );
  });

  it('must check that the passwords are not the same and return undefined', async () => {
    const newPassword = { password: 'invalid', newPassword: 'jorge' };

    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(credentials) as UserPromise);

    const expectedReturn = undefined;

    expect(expectedReturn).toBe(
      await service.updatePassword(userId, newPassword),
    );
  });

  it('should check that the credentials are invalid and return undefined', async () => {
    const newPassword = { password: 'invalid', newPassword: 'jorge' };

    jest.spyOn(service, 'findOne').mockReturnValue(Promise.resolve(null));

    const expectedReturn = undefined;

    expect(expectedReturn).toBe(
      await service.updatePassword(userId, newPassword),
    );
  });
});
