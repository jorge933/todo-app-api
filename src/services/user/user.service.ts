import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from 'src/controllers/user/update-credentials.dto';
import { DomainErrorsService } from 'src/modules/unit-of-work/domain-errors/domain-errors.service';
import { UserRepository } from 'src/repositories/user/user.repository';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';

interface CredentialUpdate {
  email: string;
  photo: string;
  username: string;
}

@Injectable()
export class UserService {
  userRepository: UserRepository;
  domainErrorsService: DomainErrorsService;

  constructor(private readonly unitOfWork: UnitOfWorkService) {
    this.userRepository = unitOfWork.userRepository;
    this.domainErrorsService = unitOfWork.domainErrorsService;
  }

  async updateUserCredential<PropToUpdate extends keyof CredentialUpdate>(
    userId: number,
    credential: Pick<CredentialUpdate, PropToUpdate>,
    unique: boolean = true,
  ) {
    const [property] = Object.keys(credential);

    const newCredentialValue = {
      [property]: credential[property],
    };

    const existUserWithCredential =
      await this.userRepository.findOne(newCredentialValue);

    if (existUserWithCredential && unique) {
      this.domainErrorsService.addError({
        message: `Este ${property} já foi registrado!`,
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
