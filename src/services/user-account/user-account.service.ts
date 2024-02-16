import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from '../../controllers/user-account/update-credentials.dto';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { User } from '../../schemas/user.schema';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class UserAccountService extends BaseService<User> {
  domainErrorsService: DomainErrorsService;

  constructor({ domainErrorsService, userRepository }: UnitOfWorkService) {
    super(userRepository);
    this.domainErrorsService = domainErrorsService;
  }

  async updateUserCredential<PropToUpdate extends keyof User>(
    userId: number,
    newCredential: Pick<User, PropToUpdate>,
    fieldToUpdateIsUnique = true,
  ) {
    const [property] = Object.keys(newCredential);

    const newCredentialValue = {
      [property]: newCredential[property],
    };

    const existUserWithCredential = await this.findOne(newCredentialValue);

    if (existUserWithCredential && fieldToUpdateIsUnique) {
      this.domainErrorsService.addError(
        {
          message: `Este ${property} já foi registrado!`,
          type: HttpTypeErrors.ALREADY_BEEN_REGISTERED,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    this.updateOne({ _id: userId }, { ...newCredentialValue });
    return newCredentialValue;
  }

  async updatePassword(
    userId: number,
    { password, newPassword }: UpdatePasswordDto,
  ) {
    const user = await this.findOne({ _id: userId });

    const pass = user?.password ?? '';
    const equalPasswords = await bcrypt.compare(password, pass);

    const invalidCredentials = !user || !equalPasswords;

    if (invalidCredentials) {
      this.domainErrorsService.addError(
        {
          message: 'Credenciais inválidas!',
          type: HttpTypeErrors.INVALID_CREDENTIALS,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const newPasswordHashed = await bcrypt.hash(newPassword, 10);

    this.updateOne({ _id: userId }, { password: newPasswordHashed });
    return { message: 'Senha atualizada!' };
  }
}
