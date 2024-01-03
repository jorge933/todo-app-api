import { Injectable } from '@nestjs/common';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { UserRepository } from 'src/repositories/user/user.repository';
import { DomainErrorsService } from 'src/modules/unit-of-work/domain-errors/domain-errors.service';
import { UpdatePasswordDto } from 'src/controllers/user/update-credentials.dto';
import * as bcrypt from 'bcrypt';

interface CredentialUpdate {
  email?: string;
  username?: string;
}

@Injectable()
export class UserService {
  userRepository: UserRepository;
  domainErrorsService: DomainErrorsService;

  constructor(private readonly unitOfWork: UnitOfWorkService) {
    this.userRepository = unitOfWork.userRepository;
    this.domainErrorsService = unitOfWork.domainErrorsService;
  }

  async updateUserCredential<PropToOmit extends 'email' | 'username'>(
    userId: number,
    credential: Omit<CredentialUpdate, PropToOmit>,
  ) {
    const [property] = Object.keys(credential);

    const newCredentialValue = {
      [property]: credential[property],
    };

    const existUserWithCredential =
      await this.userRepository.findOne(newCredentialValue);

    if (existUserWithCredential) {
      this.domainErrorsService.addError({
        message: `Este ${property} já foi regristrado`,
      });
      return;
    }

    this.userRepository.updateOne(
      { _id: userId },
      { $set: newCredentialValue },
    );
    return newCredentialValue;
  }

  async updatePassword(
    userId: number,
    { password, newPassword }: UpdatePasswordDto,
  ) {
    if (password === newPassword) {
      this.unitOfWork.domainErrorsService.addError({
        message: 'As senhas não podem ser iguais!',
      });
      return;
    }

    const user = await this.userRepository.findOne({ _id: userId });

    const pass = user?.password ?? '';

    const equalPasswords = await bcrypt.compare(password, pass);

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.unitOfWork.domainErrorsService.addError({
        message: 'Senha incorreta!',
      });
      return;
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);

    this.userRepository.updateOne(
      { _id: userId },
      { $set: { password: newPasswordHashed } },
    );
    return { message: 'Senha atualizada!' };
  }
}
