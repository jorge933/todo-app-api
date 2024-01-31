import { Injectable } from '@nestjs/common';

import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UserRepository } from '../repositories/user/user.repository';

@ValidatorConstraint({ name: 'userValidator', async: true })
@Injectable()
export class ExistUserValidation implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(credential: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      $or: [{ username: credential }, { email: credential }],
    });

    return !!user;
  }
}

export function IsValidUser(options?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Este usuário não existe!',
        ...options,
      },
      validator: ExistUserValidation,
    });
  };
}
