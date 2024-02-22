import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  UpdatePasswordDto,
  UpdateUserCredentials,
} from '../../controllers/user-account/update-credentials.dto';
import { HttpTypeErrors } from '../../enums/http-type-errors';
import { DomainErrorsService } from '../../services/domain-errors/domain-errors.service';
import { User } from '../../schemas/user.schema';
import { UnitOfWorkService } from '../../modules/unit-of-work/unit-of-work.service';
import { BaseService } from '../base/base.service';

@Injectable()
export class UserAccountService extends BaseService<User> {
  domainErrorsService: DomainErrorsService;

  uniqueFields = ['email', 'username'];
  fieldsThatCanUpdate = [...this.uniqueFields, 'photo'];

  constructor({ domainErrorsService, userRepository }: UnitOfWorkService) {
    super(userRepository);
    this.domainErrorsService = domainErrorsService;
  }

  async updateUserCredential(
    userId: number,
    newCredential: UpdateUserCredentials,
  ) {
    const filteredNullValues = Object.entries(newCredential).filter(
      ([key, value]) => !!value,
    );
    const [[key, value]] = filteredNullValues;

    const canUpdate = this.fieldsThatCanUpdate.includes(key);

    if (!canUpdate) {
      this.domainErrorsService.addError(
        {
          message: 'Você não pode atualizar esta propriedade!',
          type: HttpTypeErrors.CANNOT_PERFORM_THIS_ACTION,
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    const isUnique = this.uniqueFields.includes(key);

    if (isUnique) {
      const existRegisters = await this.findOne({ [key]: value });

      if (existRegisters) {
        this.domainErrorsService.addError(
          {
            message: `Este ${key} já foi registrado!`,
            type: HttpTypeErrors.ALREADY_BEEN_REGISTERED,
          },
          HttpStatus.UNAUTHORIZED,
        );
        return;
      }
    }

    await this.updateOne({ _id: userId }, { [key]: value });

    return {
      [key]: value,
    };
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
